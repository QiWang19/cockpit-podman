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