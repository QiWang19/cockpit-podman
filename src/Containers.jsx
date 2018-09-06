import React from 'react';
import cockpit from 'cockpit';
import * as Listing from '../lib/cockpit-components-listing.jsx';
import ContainerDetails from './ContainerDetails.jsx';
import Dropdown from './DropdownContainer.jsx';
import ContainerDeleteModal from './ContainerDeleteModal.jsx';
import ContainerRemoveErrorModal from './ContainerRemoveErrorModal.jsx';
import * as utils from './util.js';
import ContainerCommitModal from './ContainerCommitModal.jsx';

const _ = cockpit.gettext;

class Containers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectContainerDeleteModal: false,
            setContainerRemoveErrorModal: false,
            setContainerCommitModal: false,
            containerWillDelete: {},
            containerWillCommit: {},
            setWaitCursor:"",
        };
        this.renderRow = this.renderRow.bind(this);
        this.restartContainer = this.restartContainer.bind(this);
        this.startContainer = this.startContainer.bind(this);
        this.stopContainer = this.stopContainer.bind(this);
        this.deleteContainer = this.deleteContainer.bind(this);
        this.handleCancelContainerDeleteModal = this.handleCancelContainerDeleteModal.bind(this);
        this.handleRemoveContainer = this.handleRemoveContainer.bind(this);
        this.handleCancelRemoveError = this.handleCancelRemoveError.bind(this);
        this.handleForceRemoveContainer = this.handleForceRemoveContainer.bind(this);
        this.handleContainerCommitModal = this.handleContainerCommitModal.bind(this);
        this.handleCancelContainerCommitModal = this.handleCancelContainerCommitModal.bind(this);
        this.handleContainerCommit = this.handleContainerCommit.bind(this);
    }

    navigateToContainer(container) {
        cockpit.location.go([container.ID]);
    }

    deleteContainer(container, event) {
        event.preventDefault();
        this.setState((prevState) => ({
            containerWillDelete: container,
            selectContainerDeleteModal: !prevState.selectContainerDeleteModal,
        }));
    }

    updateContainersAfterEvent() {
        utils.updateContainers()
                .then((reply) => {
                    this.props.updateContainers(reply.newContainers);
                    document.body.classList.remove('busy-cursor');
                })
                .catch(ex => {
                    console.error("Failed to do Update Container:", JSON.stringify(ex));
                    document.body.classList.remove('busy-cursor');
                });
    }

    updateImagesAfterEvent() {
        utils.updateImages()
                .then((reply) => {
                    this.props.updateImages(reply);
                    document.body.classList.remove('busy-cursor');
                })
                .catch(ex => {
                    console.error("Failed to do Update Image:", JSON.stringify(ex));
                    document.body.classList.remove('busy-cursor');
                });
    }

    stopContainer(container, timeout) {
        document.body.classList.add('busy-cursor');
        timeout = timeout || 10;
        utils.varlinkCall(utils.PODMAN, "io.podman.StopContainer", {name: container.ID, timeout: timeout})
                .then(reply => {
                    this.updateContainersAfterEvent();
                })
                .catch(ex => {
                    console.error("Failed to do StopContainer call:", JSON.stringify(ex));
                    document.body.classList.remove('busy-cursor');
                });
    }

    startContainer (container) {
        document.body.classList.add('busy-cursor');
        const id = container.ID;
        utils.varlinkCall(utils.PODMAN, "io.podman.StartContainer", {name: id})
                .then(reply => {
                    this.updateContainersAfterEvent();
                })
                .catch(ex => {
                    console.error("Failed to do StartContainer call:", JSON.stringify(ex));
                    document.body.classList.remove('busy-cursor');
                });
    }

    restartContainer (container, timeout) {
        document.body.classList.add('busy-cursor');
        if (!timeout) {
            timeout = 10;
        }
        utils.varlinkCall(utils.PODMAN, "io.podman.RestartContainer", {name: container.ID, timeout: timeout})
                .then(reply => {
                    this.updateContainersAfterEvent();
                })
                .catch(ex => {
                    console.error("Failed to do RestartContainer call:", JSON.stringify(ex));
                    document.body.classList.remove('busy-cursor');
                });
    }

    handleContainerCommitModal(event, container) {
        console.log("commit");
        console.log(event.target.attributes.getNamedItem('data-container-id').value);
        this.setState((prevState) => ({
            containerWillCommit: container,
            setContainerCommitModal: !prevState.setContainerCommitModal
        }));
        console.log(container);
    }

    handleCancelContainerCommitModal() {
        this.setState((prevState) => ({
            setContainerCommitModal: !prevState.setContainerCommitModal
        }));
    }

    handleContainerCommit(commitMsg) {
        let userStr = commitMsg.user.trim() === "" ? "" : commitMsg.user.trim();
        console.log(commitMsg.format);

        let workDirStr = commitMsg.workdir.trim() === ""
            ? (this.state.containerWillCommit.Config ? this.state.containerWillCommit.Config.WorkingDir : "")
            : commitMsg.workdir.trim();
        let workDir = "WORKDIR=" + "'" + workDirStr + "'";

        // If these fields are empty, use original cmd from container
        let stopSigStr = commitMsg.stopsignal.trim() === "" ? (this.state.containerWillCommit.Config ? this.state.containerWillCommit.Config.StopSignal : "") : commitMsg.stopsignal.trim();

        let cmdStr = "";
        if (commitMsg.command.trim() === "") {
            cmdStr = this.state.containerWillCommit.Config ? this.state.containerWillCommit.Config.Cmd.join(" ") : "";
        } else {
            cmdStr = commitMsg.command.trim();
        }

        let entryPointStr = "";
        if (commitMsg.entrypoint.trim() === "") {
            entryPointStr = this.state.containerWillCommit.Config ? this.state.containerWillCommit.Config.Entrypoint : "";
        } else {
            entryPointStr = commitMsg.entrypoint.trim();
        }

        let commitData = {};
        commitData.name = this.state.containerWillCommit.ID;
        commitData.image_name = commitMsg.imageName;
        commitData.author = commitMsg.author;
        commitData.message = commitMsg.message;
        commitData.pause = commitMsg.pause;
        commitData.format = commitMsg.format;

        commitData.changes = [];
        let userData = "User=" + userStr;
        let stopSignalData = "STOPSIGNAL=" + stopSigStr;
        let cmdData = "CMD=" + cmdStr;
        let entryPointData = "ENTRYPOINT=" + entryPointStr;
        commitData.changes.push(userData);
        commitData.changes.push(stopSignalData);
        commitData.changes.push(cmdData);
        commitData.changes.push(entryPointData);

        let portsArr = [];
        let envsArr = [];
        let labelsArr = [];
        let volumesArr = [];
        let onbuildsArr = [];

        if (commitMsg.setport) {
            portsArr = utils.getCommitArr(commitMsg.ports, "EXPOSE");
        }
        if (commitMsg.setenv) {
            envsArr = utils.getCommitArr(commitMsg.envs, "ENV");
        }
        if (commitMsg.setlabel) {
            labelsArr = utils.getCommitArr(commitMsg.labs, "LABEL");
        }
        if (commitMsg.setvolume) {
            volumesArr = utils.getCommitArr(commitMsg.volumes, "VOLUME");
        }
        if (commitMsg.setonbuild) {
            onbuildsArr = utils.getCommitArr(commitMsg.onbuild, "ONBUILD");
        }
        commitData.changes.push(...portsArr);
        commitData.changes.push(...envsArr);
        commitData.changes.push(...volumesArr);
        commitData.changes.push(...onbuildsArr);
        commitData.changes.push(...labelsArr);
        if (workDirStr !== "/" && workDirStr !== "") {
            commitData.changes.push(workDir);
        }
        console.log(commitData);
        // execute the API Commit method
        utils.varlinkCall(utils.PODMAN, "io.podman.Commit", commitData)
                .then(reply => {
                    this.updateImagesAfterEvent();
                })
                .catch(ex => {
                    console.error("Failed to do Commit call:", ex, JSON.stringify(ex));
                    document.body.classList.remove('busy-cursor');
                });
        this.setState((prevState) => ({
            setContainerCommitModal: !prevState.setContainerCommitModal
        }));
    }

    renderRow(containersStats, container) {
        const containerStats = containersStats[container.ID] ? containersStats[container.ID] : undefined;
        const isRunning = !!container.State.Running;
        const image = container.ImageName;
        const state = container.State.Status;

        let columns = [
            { name: container.Name, header: true },
            image,
            container.Config.Cmd ? container.Config.Cmd.join(" ") : undefined,
            container.State.Running ? utils.format_cpu_percent(container.HostConfig.CpuPercent) : "",
            container.State.Running && containerStats ? utils.format_memory_and_limit(containerStats.mem_usage, containerStats.mem_limit) : "",
            state /* TODO: i18n */,
        ];
        let tabs = [{
            name: _("Details"),
            renderer: ContainerDetails,
            data: { container: container }
        }];

        let startStopActions = [];
        if (isRunning)
            startStopActions.push({ label: _("Stop"), onActivate: () => this.stopContainer(container) });
        else
            startStopActions.push({ label: _("Start"), onActivate: () => this.startContainer(container) });

        startStopActions.push({
            label: _("Restart"),
            onActivate: () => this.restartContainer(container),
            disabled: !isRunning
        });

        var actions = [
            <button
                key={container.ID + "delete"}
                className="btn btn-danger btn-delete pficon pficon-delete"
                onClick={(event) => this.deleteContainer(container, event)} />,
            <button
                id="btn-container-commit"
                key={container.ID + "commit"}
                className="btn btn-default"
                data-container-id={container.ID}
                data-container-name={container.Name}
                data-toggle="modal" data-target="#container-commit-dialog"
                onClick={(event) => this.handleContainerCommitModal(event, container)}
            >
                {_("Commit")}
            </button>,
            <Dropdown key={_(container.ID)} actions={startStopActions} />
        ];

        return <Listing.ListingRow
                    key={container.ID}
                    rowId={container.ID}
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
        document.body.classList.add('busy-cursor');
        const container = this.state.containerWillDelete;
        const id = this.state.containerWillDelete ? this.state.containerWillDelete.ID : "";
        this.setState({
            selectContainerDeleteModal: false
        });
        utils.varlinkCall(utils.PODMAN, "io.podman.RemoveContainer", {name: id})
                .then((reply) => {
                    this.updateContainersAfterEvent();
                })
                .catch((ex) => {
                    if (container.State.Running) {
                        this.containerRemoveErrorMsg = _(ex);
                    } else {
                        this.containerRemoveErrorMsg = _("Container is currently marked as not running, but regular stopping failed.") +
                        " " + _("Error message from Podman:") + " '" + ex;
                    }
                    this.setState({
                        setContainerRemoveErrorModal: true
                    });
                    document.body.classList.remove('busy-cursor');
                });
    }

    handleCancelRemoveError() {
        this.setState({
            setContainerRemoveErrorModal: false
        });
    }

    handleSetWaitCursor() {
        this.setState((prevState) => ({
            setWaitCursor: prevState.setWaitCursor === "" ? "wait-cursor" : ""
        }));
    }

    handleForceRemoveContainer() {
        document.body.classList.add('busy-cursor');
        this.handleSetWaitCursor();
        const id = this.state.containerWillDelete ? this.state.containerWillDelete.ID : "";
        utils.varlinkCall(utils.PODMAN, "io.podman.RemoveContainer", {name: id, force: true})
                .then(reply => {
                    this.updateContainersAfterEvent();

                    this.setState({
                        setContainerRemoveErrorModal: false
                    });
                    this.handleSetWaitCursor();
                })
                .catch(ex => console.error("Failed to do RemoveContainerForce call:", JSON.stringify(ex)));
    }

    render() {
        const columnTitles = [_("Name"), _("Image"), _("Command"), _("CPU"), _("Memory"), _("State")];
        // TODO: emptyCaption
        let emptyCaption = _("No running containers");
        const containersStats = this.props.containersStats;
        // TODO: check filter text
        let filtered = this.props.containers.filter(container => (!this.props.onlyShowRunning || container.State.Running));
        let rows = filtered.map(function (container) {
            return this.renderRow(containersStats, container);
        }, this);
        const containerDeleteModal =
            <ContainerDeleteModal
                selectContainerDeleteModal={this.state.selectContainerDeleteModal}
                containerWillDelete={this.state.containerWillDelete}
                handleCancelContainerDeleteModal={this.handleCancelContainerDeleteModal}
                handleRemoveContainer={this.handleRemoveContainer}
            />;
        const containerRemoveErrorModal =
            <ContainerRemoveErrorModal
                setContainerRemoveErrorModal={this.state.setContainerRemoveErrorModal}
                handleCancelRemoveError={this.handleCancelRemoveError}
                handleForceRemoveContainer={this.handleForceRemoveContainer}
                containerWillDelete={this.state.containerWillDelete}
                containerRemoveErrorMsg={this.containerRemoveErrorMsg}
                setWaitCursor={this.state.setWaitCursor}
            />;

        return (
            <div id="containers-containers" className="container-fluid ">
                <Listing.Listing key={"ContainerListing"} title={_("Containers")} columnTitles={columnTitles} emptyCaption={emptyCaption}>
                    {rows}
                </Listing.Listing>
                {containerDeleteModal}
                {containerRemoveErrorModal}
                <ContainerCommitModal
                    setContainerCommitModal={this.state.setContainerCommitModal}
                    handleContainerCommit={this.handleContainerCommit}
                    handleCancelContainerCommitModal={this.handleCancelContainerCommitModal}
                    containerWillCommit={this.state.containerWillCommit}
                />
            </div>
        );
    }
}

export default Containers;
