import React from 'react';
import cockpit from 'cockpit';
import * as Listing from '../lib/cockpit-components-listing.jsx';
import ImageDetails from './ImageDetails.jsx';
import ContainersRunImageModal from './ContainersRunImageModal.jsx';
import ImageSecurity from './ImageSecurity.jsx';
import ModalExample from './ImageDeleteModal.jsx';
import ImageRemoveErrorModal from './ImageRemoveErrorModal.jsx';
import * as utils from './util.js';

const moment = require('moment');
const atomic = require('./atomic.jsx');
const _ = cockpit.gettext;

class Images extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageDetail: undefined,
            setRunContainer: false,
            vulnerableInfos: {},
            selectImageDeleteModal: false,
            setImageRemoveErrorModal: false,
            imageWillDelete: {},
            imageWillRun: {}
        };

        this.vulnerableInfoChanged = this.vulnerableInfoChanged.bind(this);
        this.handleSearchImageClick = this.handleSearchImageClick.bind(this);
        this.showRunImageDialog = this.showRunImageDialog.bind(this);
        this.handleCancelRunImage = this.handleCancelRunImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.handleCancelImageDeleteModal = this.handleCancelImageDeleteModal.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);
        this.handleCancelImageRemoveError = this.handleCancelImageRemoveError.bind(this);
        this.handleForceRemoveImage = this.handleForceRemoveImage.bind(this);
        this.handleRunImage = this.handleRunImage.bind(this);
    }

    vulnerableInfoChanged(event, infos) {
        this.setState({ vulnerableInfos: infos });
    }

    componentDidMount() {
        atomic.addEventListener('vulnerableInfoChanged', this.vulnerableInfoChanged);
    }

    componentWillUnmount() {
        atomic.removeEventListener('vulnerableInfoChanged', this.vulnerableInfoChanged);
    }

    navigateToImage(image) {
        if (image) {
            cockpit.location.go([ 'image', image.Id ]);
        }
    }

    showRunImageDialog(e, image) {
        this.setState({
            setRunContainer: true,
            imageWillRun: image
        });
    }

    deleteImage(image) {
        this.setState((prevState) => ({
            selectImageDeleteModal: !prevState.selectImageDeleteModal,
            imageWillDelete: image,
        }));
    }

    handleCancelImageDeleteModal() {
        this.setState((prevState) => ({
            selectImageDeleteModal: !prevState.selectImageDeleteModal
        }));
    }

    handleRemoveImage() {
        const image = this.state.imageWillDelete.Id;
        this.setState({
            selectImageDeleteModal: false,
        });
        utils.varlinkCall(utils.PODMAN, "io.podman.RemoveImage", {name: image})
                .then((reply) => {
                    this.props.updateImagesAfterEvent();
                    this.props.updateContainersAfterEvent();
                })
                .catch(ex => {
                    this.imageRemoveErrorMsg = _(ex);
                    this.setState({
                        setImageRemoveErrorModal: true,
                    });
                });
    }

    handleForceRemoveImage() {
        document.body.classList.add('busy-cursor');
        const id = this.state.imageWillDelete ? this.state.imageWillDelete.Id : "";
        utils.varlinkCall(utils.PODMAN, "io.podman.RemoveImage", {name: id, force: true})
                .then(reply => {
                    this.props.updateImagesAfterEvent();
                    // update the container list in case the image deleted used by a container
                    this.props.updateContainersAfterEvent();
                    this.setState({
                        setImageRemoveErrorModal: false
                    });
                })
                .catch(ex => console.error("Failed to do RemoveImageForce call:", JSON.stringify(ex)));
    }

    renderRow(image) {
        let vulnerabilityColumn = '';
        let vulnerableInfo = image ? this.state.vulnerableInfos[image.Id.replace(/^sha256:/, '')] : "";
        let count;
        let tabs = [];

        if (vulnerableInfo) {
            count = vulnerableInfo.vulnerabilities.length;
            if (count > 0)
                vulnerabilityColumn = (
                    <div>
                        <span className="pficon pficon-warning-triangle-o" />
                        &nbsp;
                        { cockpit.format(cockpit.ngettext('1 Vulnerability', '$0 Vulnerabilities', count), count) }
                    </div>
                );
        }
        // TODO: image waiting if - else
        let element =
            <button
                key={image ? image.Id + "runimage" : "runimage"}
                className="btn btn-default btn-control-ct fa fa-play"
                onClick={ (event) => this.showRunImageDialog(event, image) }
                data-image={image ? image.Id : ""}
            />;
        let columns = [
            {name: image && image.RepoTags ? image.RepoTags[0] : "", header: true},
            vulnerabilityColumn,
            image && moment(image.Created).isValid() ? moment(image.Created).calendar() : "",
            image ? cockpit.format_bytes(image.VirtualSize) : "",
            {
                element: element,
                tight: true
            }
        ];

        tabs.push({
            name: _("Details"),
            renderer: ImageDetails,
            data: { image: image }
        });
        if (vulnerableInfo !== undefined) {
            tabs.push({
                name: _("Security"),
                renderer: ImageSecurity,
                data: {
                    image: image,
                    info: vulnerableInfo,
                }
            });
        }

        let actions = [
            <button
                key={image ? image.Id + "delete" : "delete"}
                className="btn btn-danger btn-delete pficon pficon-delete"
                onClick={() => this.deleteImage(image)}
            />
        ];
        return <Listing.ListingRow
                    key={image ? image.Id : "imageKey"}
                    rowId={image ? image.Id : "rowId"}
                    columns={columns}
                    tabRenderers={tabs}
                    navigateToItem={image ? this.navigateToImage(image) : undefined}
                    listingActions={actions}
        />;
    }

    // TODO
    handleSearchImageClick() {
        return undefined;
    }

    handleCancelRunImage() {
        this.setState(() => ({
            setRunContainer: false
        }));
    }

    handleCancelImageRemoveError() {
        this.setState({
            setImageRemoveErrorModal: false
        });
    }

    // TODO
    handleRunImage(runImgData) {
        console.log(runImgData);

        let imgName = null;
        if (this.state.imageWillRun && this.state.imageWillRun.RepoTags) {
            // let start = this.state.imageWillRun.RepoTags[0].lastIndexOf("/") + 1;
            // let end = this.state.imageWillRun.RepoTags[0].length;
            // imgName = this.state.imageWillRun.RepoTags[0].substring(start, end);
            imgName = this.state.imageWillRun.RepoTags[0];
        }
        console.log(imgName);
        console.log(runImgData.ports);

        let image_id = this.state.imageWillRun.Id;

        let user = this.state.imageWillRun.User;
        if (runImgData.user !== '') {
            user = runImgData.user;
        }

        let command = null;
        if (this.state.imageWillRun.ContainerConfig && this.state.imageWillRun.ContainerConfig.Cmd) {
            command = this.state.imageWillRun.ContainerConfig.Cmd;
        }
        if (runImgData.command !== '') {
            command = runImgData.command.split(" ");
        }

        let stop_signal = Number(runImgData.stopSignal);

        let work_dir = this.state.imageWillRun.GraphDriver ? this.state.imageWillRun.GraphDriver.Data.WorkDir : null;
        if (runImgData.workdir !== '') {
            work_dir = runImgData.workdir;
        }

        let exposed_ports = utils.getRunImgMsg(runImgData.ports, "exposed_ports");

        let volumes = utils.getRunImgMsg(runImgData.volumes, "volumes");

        let labels = utils.getRunImgMsg(runImgData.labs, "labels");

        let env = utils.getRunImgMsg(runImgData.envs, "env");

        let imageToRun = {};
        imageToRun.create = {};
        imageToRun.create.image = imgName;
        imageToRun.create.image_id = image_id;
        imageToRun.create.user = user;
        imageToRun.create.command = command;
        imageToRun.create.stop_signal = stop_signal;
        imageToRun.create.work_dir = work_dir;
        if (runImgData.exposed_ports) {
            imageToRun.create.exposed_ports = exposed_ports;
        }

        if (runImgData.mount_volumes) {
            imageToRun.create.volumes = volumes;
        }

        if (runImgData.claim_labels) {
            imageToRun.create.labels = labels;
        }

        if (runImgData.claim_envvars) {
            imageToRun.create.env = env;
        }
        console.log(imageToRun);

        utils.varlinkCall(utils.PODMAN, "io.podman.CreateContainer", imageToRun)
                .then(reply => {
                    console.log(reply.container);
                    utils.varlinkCall(utils.PODMAN, "io.podman.StartContainer", {name: reply.container})
                            .then(reply => {
                                this.props.updateContainersAfterEvent();
                            })
                            .catch(ex => {
                                console.error("Failed to do StartContainer call:", JSON.stringify(ex));
                            });
                })
                .catch(ex => {
                    console.error("Failed to do CreateContainer call:", JSON.stringify(ex));
                });

        this.setState(() => ({
            setRunContainer: false
        }));
    }

    render() {
        const columnTitles = [ _("Name"), _(''), _("Created"), _("Size"), _('') ];
        // TODO: emptyCaption = _("No Images");
        // let emptyCaption = _("No images that match the current filter");
        let emptyCaption = '';
        if (this.props.filterText.length === 0 || this.props.filterText.length === '') {
            emptyCaption = _("No images");
        } else {
            emptyCaption = _("No images that match the current filter");
        }
        const getNewImageAction =
                [<a key={"searchImages"} role="link" tabIndex="0" onClick={this.handleSearchImageClick} className="card-pf-link-with-icon pull-right">
                    <span className="pficon pficon-add-circle-o" />{_("Get new image")}
                </a>];
        // TODO: filter images via filterText
        let filtered = [];
        // Object.keys(this.props.images).filter(id => { filtered[id] = this.props.images[id] });
        // let imageRows = Object.keys(filtered).map((id) => this.renderRow(this.props.images[id]), this);
        if (this.props.filterText.length === 0) {
            Object.keys(this.props.images).filter(id => { filtered[id] = this.props.images[id] });
        } else {
            Object.keys(this.props.images).filter(id => {
                if (this.props.images[id].RepoTags && this.props.images[id].RepoTags[0].indexOf(this.props.filterText) >= 0) {
                    filtered[id] = this.props.images[id];
                }
            });
        }

        let imageRows = Object.keys(filtered).map((id) => this.renderRow(this.props.images[id]), this);
        const imageDeleteModal =
            <ModalExample
                    selectImageDeleteModal={this.state.selectImageDeleteModal}
                    imageWillDelete={this.state.imageWillDelete}
                    handleCancelImageDeleteModal={this.handleCancelImageDeleteModal}
                    handleRemoveImage={this.handleRemoveImage}
            />;
        const imageRemoveErrorModal =
            <ImageRemoveErrorModal
                    setImageRemoveErrorModal={this.state.setImageRemoveErrorModal}
                    handleCancelImageRemoveError={this.handleCancelImageRemoveError}
                    handleForceRemoveImage={this.handleForceRemoveImage}
                    imageWillDelete={this.state.imageWillDelete}
                    imageRemoveErrorMsg={this.imageRemoveErrorMsg}
            />;

        return (
            <div id="containers-images" key={"images"} className="container-fluid" >
                <div key={"imageslist"}>
                    <Listing.Listing
                            key={"ImagesListing"}
                            title={_("Images")}
                            columnTitles={columnTitles}
                            emptyCaption={emptyCaption}
                            actions={getNewImageAction}>
                        {imageRows}
                    </Listing.Listing>
                    {/* TODO: {pendingRows} */}
                </div>
                <ContainersRunImageModal
                            show={this.state.setRunContainer}
                            imageWillRun={this.state.imageWillRun}
                            handleCancelRunImage={this.handleCancelRunImage}
                            handleRunImage={this.handleRunImage}
                />
                {imageDeleteModal}
                {imageRemoveErrorModal}
            </div>
        );
    }
}

export default Images;
