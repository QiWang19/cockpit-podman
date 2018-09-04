import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class ContainerCommitModal extends React.Component {
    // TODO:check required field
    constructor(props) {
        super(props);
        this.initialState = {
            imageName: "",
            author:"",
            message: "",
            user: "",
            stopsignal: this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.StopSignal : "",
            workdir: this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.WorkingDir : "",
            command: this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.Cmd.join(" ") : "",
            entrypoint: this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.Entrypoint : "",
            pause: true,
            setenv: false,
            setonbuild: false,
            setport: false,
            setlabel: false,
            setvolume: false,
            // name: '',
            envs: [{envvar_key: '', envvar_value: ''}],
            labs:[{labvar_key: '', labvar_value: ''}],
            ports:[""],
            volumes:[""],
            onbuild: [""],
            format:"",
            selectedFormat: "",
            onbuildDisabled: true,
        };
        this.state = this.initialState;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
        this.handleEnvsInputChange = this.handleEnvsInputChange.bind(this);
        this.handleAddEnv = this.handleAddEnv.bind(this);
        this.handleRemoveEnv = this.handleRemoveEnv.bind(this);
        this.handleLabsInputChange = this.handleLabsInputChange.bind(this);
        this.handleAddLab = this.handleAddLab.bind(this);
        this.handleRemoveLab = this.handleRemoveLab.bind(this);
        this.handlePortsInputChange = this.handlePortsInputChange.bind(this);
        this.handleAddPort = this.handleAddPort.bind(this);
        this.handleRemovePort = this.handleRemovePort.bind(this);
        this.handleVolumesInputChange = this.handleVolumesInputChange.bind(this);
        this.handleAddVolume = this.handleAddVolume.bind(this);
        this.handleRemoveVolume = this.handleRemoveVolume.bind(this);
        this.handleOnbuildsInputChange = this.handleOnbuildsInputChange.bind(this);
        this.handleAddOnbuild = this.handleAddOnbuild.bind(this);
        this.handleRemoveOnbuild = this.handleRemoveOnbuild.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
    }

    handleEnvsInputChange(idx, evt) {
        const newEnvs = this.state.envs.map((env, sidx) => {
            if (idx !== sidx) return env;
            console.log(env);
            console.log(evt.target.value);
            env[evt.target.name] = evt.target.value;
            return env;
        });

        this.setState({ envs: newEnvs });
    }

    handleLabsInputChange(idx, evt) {
        const newLabs = this.state.labs.map((lab, sidx) => {
            if (idx !== sidx) return lab;
            console.log(lab);
            console.log(evt.target.value);
            lab[evt.target.name] = evt.target.value;
            return lab;
        });

        this.setState({labs: newLabs});
    }

    handlePortsInputChange(idx, evt) {
        const newPorts = this.state.ports.map((port, sidx) => {
            if (idx !== sidx) return port;
            console.log(port);
            console.log(evt.target.value);
            port = evt.target.value;
            return port;
        });

        this.setState({ports: newPorts});
    }

    handleVolumesInputChange(idx, evt) {
        const newVolumes = this.state.volumes.map((volume, sidx) => {
            if (idx !== sidx) return volume;
            console.log(volume);
            console.log(evt.target.value);
            volume = evt.target.value;
            return volume;
        });

        this.setState({volumes: newVolumes});
    }

    handleOnbuildsInputChange(idx, evt) {
        const newOnbuilds = this.state.onbuild.map((bud, sidx) => {
            if (idx !== sidx) return bud;
            console.log(bud);
            console.log(evt.target.value);
            // bud[evt.target.name]= evt.target.value;
            bud = evt.target.value;
            return bud;
        });

        this.setState({onbuild: newOnbuilds});
    }

    handleAddEnv() {
        this.setState({ envs: this.state.envs.concat([{envvar_key: '', envvar_value: ''}]) });
    }

    handleRemoveEnv(idx) {
        this.setState({ envs: this.state.envs.filter((env, sidx) => idx !== sidx) });
    }

    handleAddLab() {
        this.setState({labs: this.state.labs.concat([{labvar_key: '', labvar_value: ''}])});
    }

    handleRemoveLab(idx) {
        this.setState({labs: this.state.labs.filter((lab, sidx) => idx !== sidx)});
    }

    handleAddPort() {
        this.setState({ports: this.state.ports.concat([""])});
    }

    handleRemovePort(idx) {
        this.setState({ports: this.state.ports.filter((port, sidx) => idx !== sidx)});
    }

    handleAddVolume() {
        this.setState({volumes: this.state.volumes.concat([""])});
    }

    handleRemoveVolume(idx) {
        this.setState({volumes: this.state.volumes.filter((vol, sidx) => idx !== sidx)});
    }

    handleAddOnbuild() {
        console.log(this.state.onbuild);
        this.setState({onbuild: this.state.onbuild.concat([""])});
    }

    handleRemoveOnbuild(idx) {
        this.setState({onbuild: this.state.onbuild.filter((bud, sidx) => idx !== sidx)});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleFormatChange(event) {
        const selectItem = event.target.value;
        this.setState({
            selectedFormat: selectItem,
            format: selectItem,
            onbuildDisabled: false
        });
    }

    handleCommit() {
        const commitMsg = this.state;
        // console.log(this.state);
        this.props.handleContainerCommit(commitMsg);
        this.setState(this.initialState);
    }

    handleCancel() {
        this.props.handleCancelContainerCommitModal();
        this.setState(this.initialState);
    }

    render() {
        let environments = this.state.envs.map((env, idx) => (
            <div key={"envvar" + idx} className="form-inline form-group">
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="envvar_key" className="form-control-half"
                            onChange={(evt) => this.handleEnvsInputChange(idx, evt)}
                    />
                </div>
                <div className="form-group">
                    <label>Value</label>
                    <input type="text" name="envvar_value" className="form-control-half"
                            onChange={(evt) => this.handleEnvsInputChange(idx, evt)}
                    />
                </div>
                <button type="button" onClick={() => this.handleRemoveEnv(idx)} className="small" disabled={idx === 0}>-</button>
            </div>
        ));
        let addEnvBtn = <p align="right"><button type="button" onClick={this.handleAddEnv} className="small">Add Env</button></p>;

        let labels =
            this.state.labs.map((lab, idx) => (
                <div key={"labvar" + idx} className="form-inline form-group">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="labvar_key" className="form-control-half"
                            onChange={(evt) => this.handleLabsInputChange(idx, evt)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Value</label>
                        <input type="text" name="labvar_value" className="form-control-half"
                            onChange={(evt) => this.handleLabsInputChange(idx, evt)}
                        />
                    </div>
                    <button type="button" onClick={() => this.handleRemoveLab(idx)} className="small" disabled={idx === 0}>-</button>
                </div>
            ));
        let addLabBtn = <p align="right"><button type="button" onClick={this.handleAddLab} className="small">Add Label</button></p>;

        let exposePorts = this.state.ports.map((port, idx) => (
            <div key={"portvar" + idx} className="form-inline form-group">
                <div className="form-group">
                    {/* <label>Name</label> */}
                    <input type="text" name="labvar_key" className="form-control-commit"
                        onChange={(evt) => this.handlePortsInputChange(idx, evt)}
                    />
                </div>
                {/* <div className="form-group">
                    <label>Value</label>
                    <input type="text" name="labvar_value" className="form-control"
                        onChange={(evt) => this.handleLabsInputChange(idx, evt)}
                    />
                </div> */}
                <button type="button" onClick={() => this.handleRemovePort(idx)} className="small" disabled={idx === 0}>-</button>
            </div>
        ));
        let addPortBtn = <p align="right"><button type="button" onClick={this.handleAddPort} className="small">Add Port</button></p>;

        let vols = this.state.volumes.map((vol, idx) => (
            <div key={"volvar" + idx} className="form-inline form-group">
                <div className="form-group">
                    <input type="text" name="labvar_key" className="form-control-commit"
                        onChange={(evt) => this.handleVolumesInputChange(idx, evt)}
                    />
                </div>
                <button type="button" onClick={() => this.handleRemoveVolume(idx)} className="small" disabled={idx === 0}>-</button>
            </div>
        ));
        let addVolumeBtn = <p align="right"><button type="button" onClick={this.handleAddVolume} className="small">Add Volume</button></p>;

        let onbuilds =
            this.state.onbuild.map((bud, idx) => (
                <div key={"onbuildvar" + idx} className="form-inline form-group">
                    <div className="form-group">
                        {/* <label>Name</label> */}
                        <input type="text" name="onbuildvar_key" className="form-control-commit"
                            onChange={(evt) => this.handleOnbuildsInputChange(idx, evt)}
                        />
                    </div>
                    <button type="button" onClick={() => this.handleRemoveOnbuild(idx)} className="small" disabled={idx === 0}>-</button>
                </div>
            ));
        let addOnbuildBtn = <p align="right"><button type="button" onClick={this.handleAddOnbuild} className="small">Add Onbuild</button></p>;

        let commitContent =
            <div>
                <table className="form-table-ct">
                    <tbody>
                        <tr>
                            <td><label className="control-label" translatable="yes">Container Name</label></td>
                            <td colSpan="3">
                                <span className="container-name" />{this.props.containerWillCommit.Name}
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Format</label></td>
                            <td colSpan="3">
                                <label htmlFor="format-docker">
                                    <input type="radio" id="format-docker" value="docker" checked={this.state.selectedFormat === 'docker'} onChange={(event) => this.handleFormatChange(event)} />
                                    dokcer</label>
                                {/* <span className="container-format"/>{this.props.containerWillCommit.Name} */}
                                <label htmlFor="format-oci">
                                    <input type="radio" id="format-oci" value="oci" checked={this.state.selectedFormat === 'oci'} onChange={(event) => this.handleFormatChange(event)} />
                                    oci</label>
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Image Name</label></td>
                            <td colSpan="3">
                                <input name="imageName" className="form-control-commit container-imageName" type="text" onChange={this.handleInputChange} required="true" />
                            </td>
                        </tr>

                        <tr>
                            <td><label className="control-label" translatable="yes">Author</label></td>
                            <td colSpan="3">
                                <input name="author" className="form-control-commit container-author" type="text" onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Message</label></td>
                            <td colSpan="3">
                                <input name="message" className="form-control-commit container-message" type="text" onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Command</label></td>
                            <td colSpan="3">
                                <input name="command" className="form-control-commit container-command" type="text" defaultValue={this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.Cmd.join(" ") : ""} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Entrypoint</label></td>
                            <td colSpan="3">
                                <input name="entrypoint" className="form-control-commit container-command" type="text" defaultValue={this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.Entrypoint : ""} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">User</label></td>
                            <td colSpan="3">
                                <input name="user" className="form-control-commit container-command" type="text" onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Stop Signal</label></td>
                            <td colSpan="3">
                                <input name="stopsignal" className="form-control-commit container-command" type="text" defaultValue={this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.StopSignal : ""} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">working Directory</label></td>
                            <td colSpan="3">
                                <input name="workdir" className="form-control-commit container-command" type="text" defaultValue={this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.WorkingDir : ""} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Pause</label></td>
                            <td colSpan="3">
                                <label>
                                    <input name="pause" className="container-pause" type="checkbox" defaultChecked onChange={this.handleInputChange} />
                                    <span>pause the container</span>
                                </label>
                                <div className="containers-run-inline" />
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"><label className="control-label" translatable="yes">Environment</label></td>
                            <td colSpan="3">
                                <label>
                                    <input name="setenv" className="container-env" type="checkbox" onChange={this.handleInputChange} />
                                    <span>Set container environment variables</span>
                                </label>
                                {(this.state.setenv && <div>{environments}{addEnvBtn}</div>) }
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Label</label></td>
                            <td colSpan="3">
                                <label>
                                    <input name="setlabel" className="container-label" type="checkbox" onChange={this.handleInputChange} />
                                    <span>Set container label variables</span>
                                </label>
                                {(this.state.setlabel && <div>{labels}{addLabBtn}</div>) }
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"><label className="control-label" translatable="yes">Expose Ports</label></td>
                            <td colSpan="3">
                                <label>
                                    <input name="setport" className="container-port" type="checkbox" onChange={this.handleInputChange} />
                                    <span>Set container expose port</span>
                                </label>
                                {(this.state.setport && <div>{exposePorts}{addPortBtn}</div>) }
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"><label className="control-label" translatable="yes">Volume</label></td>
                            <td colSpan="3">
                                <label>
                                    <input name="setvolume" className="container-port" type="checkbox" onChange={this.handleInputChange} />
                                    <span>Set container volume</span>
                                </label>
                                {(this.state.setvolume && <div>{vols}{addVolumeBtn}</div>) }
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"><label className="control-label" translatable="yes">Onbuild</label></td>
                            <td colSpan="3">
                                <label>
                                    <input name="setonbuild" className="container-label" type="checkbox" disabled={this.state.onbuildDisabled} onChange={this.handleInputChange} />
                                    <span>Set container onbuild variables</span>
                                </label>
                                {(this.state.setonbuild && <div>{onbuilds}{addOnbuildBtn}</div>) }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>;

        return (
            <Modal
                show={this.props.setContainerCommitModal}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">Commit Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {commitContent}

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleCancel}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleCommit}>Commit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ContainerCommitModal;
