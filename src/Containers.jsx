import React from 'react';
import cockpit from 'cockpit';
import Listing from '../lib/cockpit-components-listing.jsx';
import ContainerDetails from './ContainerDetails.jsx';
import Dropdown from './DropdownContainer.jsx';
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
            containerWillDelete: {},
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

    stopContainer(container, timeout) {
        document.body.classList.add('busy-cursor');
        const id = container.ID;
        // let timeout = 10;
        if (!timeout) {
            timeout = 10;
        }
        utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.StopContainer", JSON.parse('{"name":"' + id + '","timeout":' + timeout + '}' ))
            .then(reply => {
                const idStop = reply.container;
                //update container info after stop
                utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.InspectContainer", JSON.parse('{"name":"' + idStop + '"}'))
                    .then(reply => {
                        const newElm = JSON.parse(reply.container)
                        //replace list with updated info
                        let oldContainers = this.props.containers;
                        let idx = oldContainers.findIndex((obj => obj.ID == idStop));
                        oldContainers[idx] = newElm;
                        this.props.updateContainers(oldContainers);
                        document.body.classList.remove('busy-cursor');
                    })
                    .catch(ex => {
                        console.error("Failed to do InspectImage call:", ex, JSON.stringify(ex))
                        document.body.classList.remove('busy-cursor');

                    });
            })
            .catch(ex => {
                console.error("Failed to do StopContainer call:", JSON.stringify(ex))
                document.body.classList.remove('busy-cursor');
            });
    }

    //TODO
    startContainer (container) {
        document.body.classList.add('busy-cursor');
        const id = container.ID;
        utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.StartContainer", JSON.parse('{"name":"' + id + '"}'))
            .then(reply => {
                const idStart = reply.container;
                console.log(container);
                // setTimeout(() => {

                    // update container info after start
                    utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.InspectContainer", JSON.parse('{"name":"' + id + '"}'))
                        .then(reply => {
                            console.log(idStart);
                            const newElm = JSON.parse(reply.container)
                            //replace list with updated info
                            let oldContainers = this.props.containers;
                            let idx = oldContainers.findIndex((obj => obj.ID == idStart));
                            oldContainers[idx] = newElm;
                            this.props.updateContainers(oldContainers);
                        })
                        .catch(ex => {
                            console.error("Failed to do InspectContainer call:", ex, JSON.stringify(ex))
                            document.body.classList.remove('busy-cursor');
                        });
                        utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.GetContainerStats", JSON.parse('{"name":"' + idStart + '"}'))
                        .then(reply => {
                            let temp_container_stats = this.props.containersStats;
                            if (reply.container) {
                                // console.log(idStart);
                                console.log(reply.container);
                                temp_container_stats[idStart] = reply.container;
                            }
                            this.props.updateContainerStats(temp_container_stats);
                            document.body.classList.remove('busy-cursor');
                            // this.setState({containersStats: temp_container_stats});
                        })
                        .catch(ex => {
                            console.error("Failed to do GetContainerStats call:", ex, JSON.stringify(ex))
                            document.body.classList.remove('busy-cursor');
                        });
                // }, 500)

            })
            .catch(ex => {
                console.error("Failed to do StartContainer call:", JSON.stringify(ex))
                document.body.classList.remove('busy-cursor');
            });
    }

    restartContainer (container, timeout) {
        document.body.classList.add('busy-cursor');
        if (!timeout) {
            timeout = 10;
        }
        const id = container.ID;
        utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.RestartContainer", JSON.parse('{"name":"' + id + '","timeout":' + timeout + '}'))
            .then(reply => {
                const idRestart = reply.container;
                // update container info after start
                utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.InspectContainer", JSON.parse('{"name":"' + idRestart + '"}'))
                    .then(reply => {
                        const newElm = JSON.parse(reply.container)
                        //replace list with updated info
                        let oldContainers = this.props.containers;
                        let idx = oldContainers.findIndex((obj => obj.ID == idRestart));
                        oldContainers[idx] = newElm;
                        this.props.updateContainers(oldContainers);
                        document.body.classList.remove('busy-cursor');
                    })
                    .catch(ex => {
                        console.error("Failed to do InspectContainer call:", ex, JSON.stringify(ex))
                        document.body.classList.remove('busy-cursor');

                    });
                utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.GetContainerStats", JSON.parse('{"name":"' + idRestart + '"}'))
                    .then(reply => {
                        let temp_container_stats = this.props.containersStats;
                        if (reply.container) {
                            // console.log(idStart);
                            // console.log(reply.container);
                            temp_container_stats[idRestart] = reply.container;
                        }
                        this.props.updateContainerStats(temp_container_stats);
                        document.body.classList.remove('busy-cursor');
                        // this.setState({containersStats: temp_container_stats});
                    })
                    .catch(ex => {
                        console.error("Failed to do GetContainerStats call:", ex, JSON.stringify(ex))
                        document.body.classList.remove('busy-cursor');
                    });

            })
            .catch(ex => {
                console.error("Failed to do RestartContainer call:", JSON.stringify(ex))
                document.body.classList.remove('busy-cursor');
            });
    }


    renderRow(containersStats, container) {
        const containerStats = containersStats[container.ID] ? containersStats[container.ID] : undefined;
        const isRunning = !!container.State.Running;
        const image = container.ImageName;
        const state = container.State.Status;

        let columns = [
            { name: container.Name, header: true },
            image,
            container.Config.Cmd ? container.Config.Cmd.join(" ") : "",
            //TODO:i18n
            container.State.Running ? utils.format_cpu_percent(container.HostConfig.CpuPercent) : "",
            container.State.Running && containerStats ? utils.format_memory_and_limit(containerStats.mem_usage, containerStats.mem_limit) : "",
            state,

        ];
        let tabs = [{
            name: _("Details"),
            renderer: ContainerDetails,
            data: { container: container }
        }];

        let startStopActions = [];
        if (isRunning)
            startStopActions.push({ label: _("Stop"), onActivate: () => this.stopContainer(container, undefined)});
        else
            startStopActions.push({ label: _("Start"), onActivate: () => this.startContainer(container)});

        startStopActions.push({
            label: _("Restart"),
            // onActivate: this.restartContainer,
            onActivate: () => this.restartContainer(container, undefined),
            disabled: !isRunning
        });

        var actions = [
            <button
                key={container.ID + "delete"}
                className="btn btn-danger btn-delete pficon pficon-delete"
                onClick={(event) => this.deleteContainer(container, event)} />,
            <button
                key={container.ID + "commit"}
                className="btn btn-default"
                disabled={isRunning}
                data-container-id={container.ID}
                data-toggle="modal" data-target="#container-commit-dialog"
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
        })
        utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.RemoveContainer", JSON.parse('{"name":"' + id + '"}'))
            .then((reply) => {
                const idDel = reply.container ? reply.container : "";
                const oldContainers = this.props.containers;
                let newContainers = oldContainers.filter(elm => elm.ID !== idDel);
                this.props.updateContainers(newContainers);
                document.body.classList.remove('busy-cursor');
            })
            .catch((ex) => {
                console.log(ex.toString());
                if (container.State.Running) {
                    this.containerRemoveErrorMsg = _(ex);
                } else {
                    this.containerRemoveErrorMsg = _("Container is currently marked as not running, but regular stopping failed.") +
                        " " + _("Error message from Podman:") + " '" + ex;
                }
                this.setState({
                    setContainerRemoveErrorModal: true
                })
                document.body.classList.remove('busy-cursor');
            });
    }

    handleCancelRemoveError() {
        this.setState({
            setContainerRemoveErrorModal: false
        });
    }

    handleSetWaitCursor() {
        console.log("wait");
        this.setState((prevState)=>({
            setWaitCursor: prevState.setWaitCursor === "" ? "wait-cursor" : ""
        }))
    }

    handleForceRemoveContainer() {
        document.body.classList.add('busy-cursor');
        this.handleSetWaitCursor();
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
            document.body.classList.remove('busy-cursor');
            this.handleSetWaitCursor();
        })
        .catch(ex => console.error("Failed to do RemoveContainerForce call:", JSON.stringify(ex)));

    }

    render() {

        const columnTitles = [_("Name"), _("Image"), _("Command"), _("CPU"), _("Memory"), _("State")];
        //TODO: emptyCaption
        let emptyCaption = _("No running containers");
        // const renderRow = this.renderRow;
        const containersStats = this.props.containersStats;
        //TODO: check filter text
        let filtered = this.props.containers.filter(container => (!this.props.onlyShowRunning || container.State.Running));
        let rows = filtered.map(function (container) {
            return this.renderRow(containersStats, container)
        }, this);
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
                setWaitCursor={this.state.setWaitCursor}
            ></ContainerRemoveErrorModal>

        return (
            <div id="containers-containers" className="container-fluid ">
                    <Listing.Listing key={"ContainerListing"} title={_("Containers")} columnTitles={columnTitles} emptyCaption={emptyCaption}>
                        {rows}
                    </Listing.Listing>
                    {containerDeleteModal}
                    {containerRemoveErrorModal}
            </div>
        );
    }

}

export default Containers;
