import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class ContainerCommitModal extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            imageName: "",
            // repository: "",
            tag: "",
            author:"",
            message: "",
            command: this.props.containerWillCommit.Config ? this.props.containerWillCommit.Config.Cmd.join(" ") : "",
            pause: true,
            setonbuild: false,
            onbuild: [""],
            format: "oci",
            selectedFormat: "oci",
            onbuildDisabled: true,
        };
        this.state = this.initialState;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
        this.handleOnbuildsInputChange = this.handleOnbuildsInputChange.bind(this);
        this.handleAddOnbuild = this.handleAddOnbuild.bind(this);
        this.handleRemoveOnbuild = this.handleRemoveOnbuild.bind(this);
    }

    handleOnbuildsInputChange(idx, evt) {
        const newOnbuilds = this.state.onbuild.map((bud, sidx) => {
            if (idx !== sidx) return bud;
            console.log(bud);
            console.log(evt.target.value);
            bud = evt.target.value;
            return bud;
        });

        this.setState({onbuild: newOnbuilds});
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
            onbuildDisabled: selectItem === "oci"
        });
    }

    handleCommit() {
        const commitMsg = {...this.state};
        this.props.handleContainerCommit(commitMsg);
        this.setState(this.initialState);
    }

    handleCancel() {
        this.props.handleCancelContainerCommitModal();
        this.setState(this.initialState);
    }

    render() {
        let onbuilds =
            this.state.onbuild.map((bud, idx) => (
                <div key={"onbuildvar" + idx} id="select-claimed-onbuildvars" className="containers-run-onbuildvarclaim containers-run-inline" >
                    <form className="form-inline">
                        <button type="button" className="btn btn-default fa fa-plus" onClick={this.handleAddOnbuild} />
                        <button type="button" className="btn btn-default pficon-close" onClick={() => this.handleRemoveOnbuild(idx)} />
                        <div className="form-group">
                            <input type="text" name="onbuildvar_key" className="form-control" onChange={(evt) => this.handleOnbuildsInputChange(idx, evt)} />
                        </div>
                    </form>
                </div>
            ));

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
                                <label htmlFor="format-oci">
                                    <input type="radio" id="format-oci" value="oci" checked={this.state.selectedFormat === 'oci'} onChange={(event) => this.handleFormatChange(event)} />
                                    oci
                                </label>
                                <label htmlFor="format-docker">
                                    <input type="radio" id="format-docker" value="docker" checked={this.state.selectedFormat === 'docker'} onChange={(event) => this.handleFormatChange(event)} />
                                    docker
                                </label>
                            </td>
                        </tr>
                        {/* <tr>
                            <td><label className="control-label" translatable="yes">Repository</label></td>
                            <td colSpan="3">
                                <input name="repository" className="form-control-commit container-repository" type="text" onChange={this.handleInputChange} />
                            </td>
                        </tr> */}
                        <tr>
                            <td><label className="control-label" translatable="yes">Image Name</label></td>
                            <td colSpan="3">
                                <input name="imageName" className="form-control-commit container-imageName" type="text" onChange={this.handleInputChange} required="true" />
                            </td>
                        </tr>
                        <tr>
                            <td><label className="control-label" translatable="yes">Tag</label></td>
                            <td colSpan="3">
                                <input name="tag" className="form-control-commit container-tag" type="text" onChange={this.handleInputChange} required="true" />
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
                            <td valign="top"><label className="control-label" translatable="yes">Onbuild</label></td>
                            <td colSpan="3">
                                <label>
                                    <input name="setonbuild" className="container-label" type="checkbox" disabled={this.state.onbuildDisabled} onChange={this.handleInputChange} />
                                    <span>Set container onbuild variables</span>
                                </label>
                                {(this.state.setonbuild && <div>{onbuilds}</div>) }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>;

        return (
            <Modal
                show={this.props.setContainerCommitModal}
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
