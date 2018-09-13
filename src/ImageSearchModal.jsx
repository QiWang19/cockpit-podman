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
            downloadDisabled: true,
            selectedImageName: ""
        };
        this.state = this.initialState;
        this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.cancelSearchImage = this.cancelSearchImage.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
    }

    // TODO
    handleOnKeyUp(event) {

    }

    // TODO
    handleSelectImage(event, image, idx) {

    }

    // TODO
    cancelSearchImage() {

    }

    // TODO
    downloadImage() {

    }

    render() {
        const searchImageSpinner = <div id="containers-search-image-waiting" className="spinner" />;
        let searchResList;
        let searchResTable;
        let noResult;
        let hasResults = true;
        if (this.props.searchImageRes) {
            hasResults = true;
            searchResList = this.props.searchImageRes.map((image, idx) => (

                <tr key={"image" + idx} className={this.state.rowSelected ? this.state.rowSelected[idx] : ""} onClick={(event) => this.handleSelectImage(event, image, idx)}>
                    <td>{image.name}</td>
                    <td>{image.description}</td>
                </tr>

            ));

            searchResTable =
                <div id="containers-search-image-results">
                    <table className="table table-hover">
                        <tbody>
                            {searchResList}
                        </tbody>
                    </table>
                </div>;
        } else {
            hasResults = false;
            noResult =
                <div id="containers-search-image-no-results">
                    <span>No results for {this.searchValue}</span>
                </div>;
        }
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
                        <div id="container-search-image-modal" className="modal-body">
                            <div className="form-group has-feedback" >
                                <input autoFocus type="search" className="form-control"
                                    id="containers-search-image-search"
                                    placeholder="search by name, namespace or description"
                                    onKeyUp={(event) => this.handleOnKeyUp(event)}
                                />
                                <span className="fa fa-search form-control-feedback containers-search-image-search-icon" />
                            </div>
                            {!hasResults && <div>{noResult}</div>}
                            {(hasResults && this.props.searchFinished && <div>{searchResTable}</div>)}
                            {(!this.props.searchFinished && this.props.setSearchImageSpinner && <div>{searchImageSpinner}</div>)}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <input type="text" id="containers-search-tag" className="form-control" disabled={this.state.tagDisabled} value={this.state.tagValue} placeholder="Tag" readOnly />
                    <Button translatable="yes" onClick={this.cancelSearchImage}>Cancel</Button>
                    <Button translatable="yes" onClick={this.downloadImage} disabled={this.state.downloadDisabled}>Download</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ImageSearchModal;
