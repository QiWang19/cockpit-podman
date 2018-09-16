import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class ContainersRunImageModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickRunImage = this.handleClickRunImage.bind(this);
        this.initialState = {
            expose_ports: false,
            mount_volumes: false,
            claim_labels: false,
            claim_envvars: false,
            user: '',
            command: '',
            workdir: '',
            stopSignal: '',
            ports: [{container: '', host: ''}],
            volumes: [{container: '', host: '', opt: ''}],
            envs: [{envvar_key: '', envvar_value: ''}],
            labs: [{labvar_key: '', labvar_value: ''}],
        };
        this.state = this.initialState;
        this.handleCancel = this.handleCancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePosInputChange = this.handlePosInputChange.bind(this);
        this.handleAddPo = this.handleAddPo.bind(this);
        this.handleRemovePo = this.handleRemovePo.bind(this);
        this.handleVolsInputChange = this.handleVolsInputChange.bind(this);
        this.handleAddVol = this.handleAddVol.bind(this);
        this.handleRemoveVol = this.handleRemoveVol.bind(this);
        this.handleLabsInputChange = this.handleLabsInputChange.bind(this);
        this.handleAddLab = this.handleAddLab.bind(this);
        this.handleRemoveLab = this.handleRemoveLab.bind(this);
        this.handleEnvsInputChange = this.handleEnvsInputChange.bind(this);
        this.handleAddEnv = this.handleAddEnv.bind(this);
        this.handleRemoveEnv = this.handleRemoveEnv.bind(this);
    }

    // TODO
    handleClickRunImage() {
        const runImgData = {...this.state};
        this.props.handleRunImage(runImgData);
        this.setState(this.initialState);
    }

    handleCancel() {
        this.props.handleCancelRunImage();
        this.setState(this.initialState);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePosInputChange(idx, evt) {
        const newPorts = this.state.ports.map((port, sidx) => {
            if (idx !== sidx) return port;
            console.log(evt.target.value);
            console.log(port);
            port[evt.target.name] = evt.target.value;
            return port;
        });
        this.setState({ports: newPorts});
    }

    handleAddPo() {
        this.setState({ports: this.state.ports.concat([{container: '', host: ''}])});
    }

    handleRemovePo(idx) {
        this.setState({ports: this.state.ports.filter((po, sidx) => idx !== sidx)});
    }

    handleVolsInputChange(idx, evt) {
        const newVolumes = this.state.volumes.map((volume, sidx) => {
            if (idx !== sidx) return volume;
            console.log(volume);
            console.log(evt.target.value);
            volume[evt.target.name] = evt.target.value;
            return volume;
        });

        this.setState({volumes: newVolumes});
    }

    handleAddVol() {
        this.setState({volumes: this.state.volumes.concat([{container: '', host: '', opt: ''}])});
    }

    handleRemoveVol(idx) {
        this.setState({volumes: this.state.volumes.filter((vol, sidx) => idx !== sidx)});
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

    handleAddLab() {
        this.setState({labs: this.state.labs.concat([{labvar_key: '', labvar_value: ''}])});
    }

    handleRemoveLab(idx) {
        this.setState({labs: this.state.labs.filter((lab, sidx) => idx !== sidx)});
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

    handleAddEnv() {
        this.setState({envs: this.state.envs.concat([{envvar_key: '', envvar_value: ''}])});
    }

    handleRemoveEnv(idx) {
        this.setState({envs: this.state.envs.filter((env, sidx) => idx !== sidx)});
    }

    render() {
        let ports = this.state.ports.map((vol, idx) => (
            <div key={"portvar" + idx} id="select-exposed-ports" className="containers-run-portmapping containers-run-inline">
                <form className="form-inline dialog-wrapper">
                    <button type="button" className="btn btn-default fa fa-plus" onClick={this.handleAddPo} />
                    <button type="button" className="btn btn-default pficon-close" disabled={idx === 0} onClick={() => this.handleRemovePo(idx)} />
                    <div className="form-group">
                        <input type="text" name="container" className="form-control" onChange={(evt) => this.handlePosInputChange(idx, evt)} />
                    </div>
                    <div className="form-group">
                        <label>to host port </label>
                        <input type="text" name="host" className="form-control" onChange={(evt) => this.handlePosInputChange(idx, evt)} />
                    </div>
                </form>
            </div>
        ));

        let volumes = this.state.volumes.map((vol, idx) => (
            <div key={"volvar" + idx} id="select-mounted-volumes" className="containers-run-volumemount containers-run-inline">
                <form className="form-inline">
                    <button type="button" className="btn btn-default fa fa-plus" onClick={this.handleAddVol} />
                    <button type="button" className="btn btn-default pficon-close" disabled={idx === 0} onClick={() => this.handleRemoveVol(idx)} />
                    <div className="form-group">
                        <input type="text" name="container" className="form-control" onChange={(evt) => this.handleVolsInputChange(idx, evt)} />
                    </div>
                    <div className="form-group">
                        <label>to host path</label>
                        <input type="text" name="host" className="form-control" onChange={(evt) => this.handleVolsInputChange(idx, evt)} />
                    </div>
                    <div className="form-group">
                        <label>options</label>
                        <input type="text" name="opt" className="form-control" onChange={(evt) => this.handleVolsInputChange(idx, evt)} />
                    </div>
                </form>
            </div>
        ));

        let labels = this.state.labs.map((lab, idx) => (
            <div key={"labvar" + idx} id="select-claimed-labvars" className="containers-run-labvarclaim containers-run-inline">
                <form className="form-inline">
                    <button type="button" className="btn btn-default fa fa-plus" onClick={this.handleAddLab} />
                    <button type="button" className="btn btn-default pficon-close" disabled={idx === 0} onClick={() => this.handleRemoveLab(idx)} />
                    <div className="form-group">
                        <label>Key </label>
                        <input type="text" name="labvar_key" className="form-control" onChange={(evt) => this.handleLabsInputChange(idx, evt)} />
                    </div>
                    <div className="form-group">
                        <label>Value </label>
                        <input type="text" name="labvar_value" className="form-control" onChange={(evt) => this.handleLabsInputChange(idx, evt)} />
                    </div>
                </form>
            </div>
        ));

        let environments = this.state.envs.map((env, idx) => (
            <div key={"envvar" + idx} id="select-claimed-envvars" className="containers-run-envvarclaim containers-run-inline">
                <form className="form-inline">
                    <button type="button" className="btn btn-default fa fa-plus" onClick={this.handleAddEnv} />
                    <button type="button" className="btn btn-default pficon-close" disabled={idx === 0} onClick={() => this.handleRemoveEnv(idx)} />
                    <div className="form-group">
                        <label>Key </label>
                        <input type="text" name="envvar_key" className="form-control" onChange={(evt) => this.handleEnvsInputChange(idx, evt)} />
                    </div>
                    <div className="form-group">
                        <label>Value </label>
                        <input type="text" name="envvar_value" className="form-control" onChange={(evt) => this.handleEnvsInputChange(idx, evt)} />
                    </div>
                </form>
            </div>
        ));

        let imgName = null;
        if (this.props.imageWillRun.RepoTags) {
            let start = this.props.imageWillRun.RepoTags[0].lastIndexOf("/") + 1;
            let end = this.props.imageWillRun.RepoTags[0].length;
            imgName = this.props.imageWillRun.RepoTags[0].substring(start, end);
        }
        // console.log(this.props.imageWillRun.User);

        let defaultUser = this.props.imageWillRun.User;
        let defaultWorkDir = this.props.imageWillRun.GraphDriver ? this.props.imageWillRun.GraphDriver.Data.WorkDir : null;
        let defaultCmd = null;
        if (this.props.imageWillRun.ContainerConfig && this.props.imageWillRun.ContainerConfig.Cmd) {
            defaultCmd = this.props.imageWillRun.ContainerConfig.Cmd.join(" ");
        }

        let runImageTable =
            <div className="modal-body">
                <table className="form-table-ct">
                    <tbody>
                        <tr>
                            <td align="right"><label className="control-label"
                                    translatable="yes">Image</label></td>
                            <td colSpan="4">
                                <span id="containers-run-image" />{imgName}
                            </td>
                        </tr>
                        <tr>
                            <td align="right"><label className="control-label" htmlFor="containers-run-image-user"
                                        translatable="yes">User</label></td>
                            <td colSpan="4">
                                <input name="user" className="form-control-run" type="text" id="containers-run-image-user" defaultValue={defaultUser} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td align="right"><label className="control-label" htmlFor="containers-run-image-command"
                                translatable="yes">Command</label></td>
                            <td colSpan="4">
                                <input name="command" className="form-control-run" type="text" id="containers-run-image-command" defaultValue={defaultCmd} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td align="right"><label className="control-label" htmlFor="containers-run-image-signal"
                                        translatable="yes">Stop signal</label></td>
                            <td colSpan="4">
                                <input name="stopSignal" className="form-control-run" type="text" id="containers-run-image-signal" onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td align="right"><label className="control-label" htmlFor="containers-run-image-workdir"
                                        translatable="yes">Work directory</label></td>
                            <td colSpan="4">
                                <input name="workdir" className="form-control-run" type="text" id="containers-run-image-workdir" defaultValue={defaultWorkDir} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" align="right"><label className="control-label" htmlFor="expose-ports" translatable="yes">Ports</label></td>
                            <td colSpan="4">
                                <label>
                                    <input type="checkbox" name="expose_ports" id="expose-ports" onChange={this.handleInputChange} />
                                    <span translatable="yes">Expose container ports</span>
                                </label>
                                {(this.state.expose_ports && <div>{ports}</div>)}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" align="right"><label className="control-label" htmlFor="mount-volumes" translatable="yes">Volumes</label></td>
                            <td colSpan="4">
                                <label>
                                    <input type="checkbox" name="mount_volumes" id="mount-volumes" onChange={this.handleInputChange} />
                                    <span translatable="yes">Mount container volumes</span>
                                </label>
                                {(this.state.mount_volumes && <div>{volumes}</div>)}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" align="right"><label className="control-label" htmlFor="claim-labels" translatable="yes">Labels</label></td>
                            <td colSpan="4">
                                <label>
                                    <input type="checkbox" name="claim_labels" id="claim-labels" onChange={this.handleInputChange} />
                                    <span translatable="yes">Set container label variables</span>
                                </label>
                                {(this.state.claim_labels && <div>{labels}</div>)}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" align="right"><label className="control-label" htmlFor="claim-envvars" translatable="yes">Environment</label></td>
                            <td colSpan="4">
                                <label>
                                    <input type="checkbox" name="claim_envvars" id="claim-envvars" onChange={this.handleInputChange} />
                                    <span translatable="yes">Set container environment variables</span>
                                </label>
                                {(this.state.claim_envvars && <div>{environments}</div>)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>;

        return (
            <Modal
                show={this.props.show}
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header>
                    <Modal.Title>Run Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {runImageTable}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleCancel}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.handleClickRunImage}>Run</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ContainersRunImageModal;
