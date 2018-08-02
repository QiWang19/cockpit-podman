import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import cockpit from 'cockpit';

const _ = cockpit.gettext;

const ContainerRemoveErrorModal = () => {
  const name = this.props.containerWillDelete ? _(this.props.containerWillDelete.Name) : _("");
  return (
    <div>
      <Modal isOpen={this.props.setContainerRemoveErrorModal} fade={false} >
        <ModalHeader>
          {cockpit.format(_("Please confirm forced deletion of $0"), name)}
        </ModalHeader>
        <ModalBody>
          {/* TODO: erorr reason */}
          {this.props.containerRemoveErrorMsg}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.handleCancelRemoveError}>{_("Cancel")}</Button>
          <Button color="danger" onClick={this.props.handleForceRemoveContainer}>{_("Force Delete")}</Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ContainerRemoveErrorModal;