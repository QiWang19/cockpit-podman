import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import cockpit from 'cockpit';

const _ = cockpit.gettext;

class ImageDeleteModal extends React.Component {
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
    const image = this.props.imageWillDelete ? this.props.imageWillDelete : undefined;
    const repoTag = image ? image.RepoTags[0] : "";
    // console.log(repoTag);

    return (

      <div>
        <Modal isOpen={this.props.selectImageDeleteModal} fade={false} toggle={this.toggle} >
          <ModalHeader>
            {cockpit.format(_("Delete $0"), repoTag)}
          </ModalHeader>
          <ModalBody>
            {_("Are you sure you want to delete this image?")}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.props.handleCancelImageDeleteModal}>Cancel</Button>
            <Button color="danger" onClick={this.props.handleRemoveImage}>{_("Delete")}</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ImageDeleteModal;