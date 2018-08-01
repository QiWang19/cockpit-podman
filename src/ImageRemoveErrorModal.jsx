import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import cockpit from 'cockpit';

const _ = cockpit.gettext;

class ImageRemoveErrorModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }



  render() {
    // const image = this.props.imageWillDelete ? this.props.imageWillDelete : undefined;
    // const repoTag = image ? image.RepoTags[0] : "";
    // console.log(repoTag);

    return (

      <div>
        <Modal isOpen={this.props.setImageRemoveErrorModal} fade={false} toggle={this.toggle} >
          <ModalHeader>
            {_("Unexpected error")}
          </ModalHeader>
          <ModalBody>
            {_("A container associated with containers/storage, i.e. via Buildah, CRI-O, etc.image is in use by a container")}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.handleCancelImageRemoveError}>Cancel</Button>
            {/* <Button color="danger" onClick={this.props.handleRemoveImage}>{_("Delete")}</Button>{' '} */}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ImageRemoveErrorModal;