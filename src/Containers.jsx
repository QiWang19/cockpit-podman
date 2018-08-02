import React from 'react';
import cockpit from 'cockpit';
import Listing from '../lib/cockpit-components-listing.jsx';
import ContainerDetails from './ContainerDetails.jsx';
import Dropdown from './DropDown.jsx';
import ContainerDeleteModal from './ContainerDeleteModal.jsx';
import ContainerRemoveErrorModal from './ContainerRemoveErrorModal.jsx';
import * as utils from './util.js';

const _ = cockpit.gettext;

class Containers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectContainerDeleteModal: false,
            setContainerRemoveErrorModal: false,
            containerWillDelete: {}
        }
        this.navigateToContainer = this.navigateToContainer.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.restartContainer = this.restartContainer.bind(this);
        this.startContainer = this.startContainer.bind(this);
        this.stopContainer = this.stopContainer.bind(this);
        this.deleteContainer = this.deleteContainer.bind(this);
        this.handleCancelContainerDeleteModal = this.handleCancelContainerDeleteModal.bind(this);
        this.handleRemoveContainer = this.handleRemoveContainer.bind(this);
        this.handleCancelRemoveError = this.handleCancelRemoveError.bind(this);
        this.handleForceRemoveContainer = this.handleForceRemoveContainer.bind(this);
    }


    navigateToContainer(container) {
        cockpit.location.go([container.ID]);
    }

    deleteContainer(container, event){
        event.preventDefault();
        this.setState((prevState) => ({
            containerWillDelete: container,
            selectContainerDeleteModal: !prevState.selectContainerDeleteModal,
        }));
    }

    //TODO
    stopContainer(container) {
        return undefined;
    }

    //TODO
    startContainer (container) {
        return undefined;
    }

    //TODO
    restartContainer (container) {
        return undefined;
    }


    renderRow(containersStats, container) {
        const containerStats = containersStats[container.ID] ? containersStats[container.ID] : undefined;
        const isRunning = !!container.State.Running;
        //TODO: check container.Image == container.ImageID
        const image = container.ImageName;
        const state = container.State.Status;

        let columns = [
            { name: container.Name, header: true },
            image,
            //Concat the cmd directly if has entrypoint, otherwise join cmd with space.
            container.Config.Entrypoint === "" ? container.Config.Cmd.join(" ") : container.Config.Cmd.join(""),
            container.State.Running ? utils.format_cpu_percent(container.HostConfig.CpuPercent) : "",
            containerStats ? utils.format_memory_and_limit(containerStats.mem_usage, containerStats.mem_limit) : "",
            state,

        ];
        let tabs = [{
            name: _("Details"),
            renderer: ContainerDetails,
            data: { container: container }
        }];

        let startStopActions = [];
        if (isRunning)
            startStopActions.push({ label: _("Stop"), onActivate: () => this.stopContainer(container)});
        else
            startStopActions.push({ label: _("Start"), onActivate: () => this.startContainer(container)});

        startStopActions.push({
            label: _("Restart"),
            onActivate: this.restartContainer,
            disabled: !isRunning
        });

        var actions = [
            <button
                className="btn btn-danger btn-delete pficon pficon-delete"
                onClick={(event) => this.deleteContainer(container, event)} />,
            <button
                className="btn btn-default"
                disabled={isRunning}
                data-container-id={container.ID}
                data-toggle="modal" data-target="#container-commit-dialog"
            >
                {_("Commit")}
            </button>,
            // TODO: stop or start dropdown menu
            <Dropdown key={_(container.ID)} actions={startStopActions} />
        ];

        return <Listing.ListingRow
                    key={container.Id}
                    columns={columns}
                    tabRenderers={tabs}
                    navigateToItem={() => this.navigateToContainer(container)}
                    listingActions={actions}
                />;
    }

    handleCancelContainerDeleteModal() {
        this.setState((prevState) => ({
            selectContainerDeleteModal: !prevState.selectContainerDeleteModal,
        }));
    }

    handleRemoveContainer() {
        const container = this.state.containerWillDelete;
        const id = this.state.containerWillDelete ? this.state.containerWillDelete.ID : "";
        this.setState({
            selectContainerDeleteModal: false
        })
        utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.RemoveContainer", JSON.parse('{"name":"' + id + '"}'))
            .then((reply) => {
                const idDel = reply.container ? reply.container : "";
                const oldContainers = this.props.containers;
                let newContainers = oldContainers.filter(elm => elm.ID !== idDel);
                this.props.updateContainers(newContainers);
            })
            .catch((ex) => {
                console.error("Failed to do RemoveContainer call:", ex, JSON.stringify(ex));
                if (container.State.Running) {
                    this.containerRemoveErrorMsg = _("Container is currently running.");
                } else {
                    //TODO:
                    this.containerRemoveErrorMsg = _("Container is currently marked as not running, but regular stopping failed.") +
                        " " + _("Error message from Podman:") + " '" + "ex.message" + "'";
                }
                this.setState({
                    setContainerRemoveErrorModal: true
                })
            });
    }

    handleCancelRemoveError() {
        this.setState({
            setContainerRemoveErrorModal: false
        });
    }

    //TODO: force
    handleForceRemoveContainer() {
        const id = this.state.containerWillDelete ? this.state.containerWillDelete.ID : "";
        utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.RemoveContainer", JSON.parse('{"name":"' + id + '","force": true }'))
        .then(reply => {
            this.setState({
                setContainerRemoveErrorModal: false
            })
            const idDel = reply.container ? reply.container : "";
            const oldContainers = this.props.containers;
            let newContainers = oldContainers.filter(elm => elm.ID !== idDel);
            this.props.updateContainers(newContainers);
        })
        .catch(ex => console.error("Failed to do RemoveContainerForce call:", JSON.stringify(ex)));

    }

    render() {

        const columnTitles = [_("Name"), _("Image"), _("Command"), _("CPU"), _("Memory"), _("State")];
        //TODO: emptyCaption
        let emptyCaption = _("No running containers");
        const renderRow = this.renderRow;
        const containersStats = this.props.containersStats;
        //TODO: check filter text
        let filtered = this.props.containers.filter(container => (!this.props.onlyShowRunning || container.State.Running));
        let rows = filtered.map(function (container) {
            return renderRow(containersStats, container)
        });
        const containerDeleteModal =
            <ContainerDeleteModal
                selectContainerDeleteModal={this.state.selectContainerDeleteModal}
                containerWillDelete={this.state.containerWillDelete}
                handleCancelContainerDeleteModal={this.handleCancelContainerDeleteModal}
                handleRemoveContainer={this.handleRemoveContainer}
            ></ContainerDeleteModal>;
        const containerRemoveErrorModal =
            <ContainerRemoveErrorModal
                setContainerRemoveErrorModal={this.state.setContainerRemoveErrorModal}
                handleCancelRemoveError={this.handleCancelRemoveError}
                handleForceRemoveContainer={this.handleForceRemoveContainer}
                containerWillDelete={this.state.containerWillDelete}
                containerRemoveErrorMsg={this.containerRemoveErrorMsg}
            ></ContainerRemoveErrorModal>

        return (
            <div className="container-fluid ">
                <div>
                    <Listing.Listing title={_("Containers")} columnTitles={columnTitles} emptyCaption={emptyCaption}>
                        {rows}
                    </Listing.Listing>
                    {containerDeleteModal}
                    {containerRemoveErrorModal}
                </div>
            </div>
        );
    }

}

export default Containers;
