import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class ImageSearchModal extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

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
                    <div class="form-group has-feedback">
                    <input type="search" class="form-control" id="containers-search-image-search"/>
                    <span class="fa fa-search form-control-feedback containers-search-image-search-icon"></span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <input type="text" id="containers-search-tag" class="form-control" disabled="disabled" placeholder="Tag" />
                    <Button translatable="yes">Cancel</Button>
                    <Button translatable="yes">Download</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ImageSearchModal;