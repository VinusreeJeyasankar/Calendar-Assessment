// GroupDetailsModal.js

import React from "react";
import { Modal } from "react-bootstrap";

function GroupDetailsModal({ show, handleClose, selectedGroup }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Group Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Group Name: {selectedGroup.groupName}</h4>
        <p>Group Description: {selectedGroup.groupDescription}</p>
        {/* Display the details of the selected group here */}
        {/* You can use selectedGroup to access the group data */}
      </Modal.Body>
    </Modal>
  );
}

export default GroupDetailsModal;
