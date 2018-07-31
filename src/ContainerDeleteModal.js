import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import cockpit from 'cockpit';
import * as utils from './util.js';

const _ = cockpit.gettext;

class ContainerDeleteModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      containerWillDelete: props.containerWillDelete
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }


  render() {
    // if (this.props.containerWillDelete) {
    //     console.log(this.props.containerWillDelete.ID);
    // }

    // const image = this.props.imageWillDelete ? this.props.imageWillDelete : undefined;
    // const container = this.state.containerWillDelete ? this.props.containerWillDeletec : undefined;
    // const repoTag = image ? image.RepoTags[0] : "";
    // const id = container ? container.ID : "";
    // console.log(id);

    return (

      <div>
        <Modal isOpen={this.props.selectContainerDeleteModal} fade={false} toggle={this.toggle} >
          <ModalHeader>
            {cockpit.format(_("Delete $0"), utils.truncate_id(this.props.containerWillDelete))}
          </ModalHeader>
          <ModalBody>
            {_("Deleting a container will erase all data in it.")}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.props.handleCancelContainerDeleteModal}>Cancel</Button>
            <Button color="danger" onClick={this.props.handleRemoveContainer}>{_("Delete")}</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ContainerDeleteModal;