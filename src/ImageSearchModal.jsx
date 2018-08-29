import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class ImageSearchModal extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            showSearchImageRes: false,
            tagValue: "",
            rowSelected:[],
            tagDisabled: "disabled",
            downloadDisabled: true
        }
        this.state = this.initialState;
        this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.cancelSearchImage = this.cancelSearchImage.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
    }

    handleOnKeyUp(event) {
        console.log(event.target.value.length,"::" ,event.target.value, event.key);
        if (event.target.value.length < 3 && event.key !== "Enter") {
            return;
        }
        //TODO:no result
        const message = event.target.value;
        this.props.doSearchImage(message);
    }

    handleSelectImage(event, image, idx) {
        let temp = [];
        this.props.searchImageRes.map((image) => {
            temp.push("");
        })
        temp[idx] = "active";
        this.setState({
            tagValue: "latest",
            rowSelected: temp,
            tagDisabled: "",
            downloadDisabled: false
        })
        console.log(image.name);
    }

    cancelSearchImage() {
        this.props.handleCancelSearchImage();
        this.setState(this.initialState);
    }

    downloadImage() {
        this.props.handleDownloadImage()
        // TODO
    }

    render() {

        const searchImageSpinner = <div id="containers-search-image-waiting" className="spinner"></div>;
        let searchResList = this.props.searchImageRes.map((image, idx) => (

            <tr key={"image" + idx} className={this.state.rowSelected ? this.state.rowSelected[idx] : ""} onClick={(event) => this.handleSelectImage(event, image, idx)}>
                <td>{image.name}</td>
                <td>{image.description}</td>
            </tr>

        ))

        let searchResTable =
            <div id="containers-search-image-results">
                <table className="table table-hover">
                <tbody>
                    {searchResList}
                </tbody>
                </table>
            </div>;
        return (

            <Modal
                show={this.props.setImageSearchModal}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header>
                    <Modal.Title >Image Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="containers-search-image-dialog">
                        <div id="container-search-image-modal"  className="modal-body">
                            <div className="form-group has-feedback" >
                                <input autoFocus type="search" className="form-control"
                                    id="containers-search-image-search"
                                    placeholder="search by name, namespace or description"
                                    onKeyUp={(event) => this.handleOnKeyUp(event)}
                                />
                                <span className="fa fa-search form-control-feedback containers-search-image-search-icon"></span>
                            </div>
                            {(this.props.searchFinished && <div>{searchResTable}</div>)}
                            {(!this.props.searchFinished && this.props.setSearchImageSpinner && <div>{searchImageSpinner}</div>)}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <input type="text" id="containers-search-tag" className="form-control" disabled={this.state.tagDisabled} value={this.state.tagValue} placeholder="Tag" />
                    <Button translatable="yes" onClick={this.cancelSearchImage}>Cancel</Button>
                    <Button translatable="yes" onClick={this.downloadImage} disabled={this.state.downloadDisabled}>Download</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ImageSearchModal;