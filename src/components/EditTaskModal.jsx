import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";

function EditTaskModal({ show, handleClose, task, handleSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setShowAlert(false); // reset alert when modal opens with a new task
  }, [task]);

  const onSave = () => {
    if (title.trim()) {
      handleSave(title, description);
      setShowAlert(true);
      // hide alert and close modal after 1.2s
      setTimeout(() => {
        setShowAlert(false);
        handleClose();
      }, 1200);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant="success" className="py-2 text-center">
            Task updated successfully!
          </Alert>
        )}
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={!title.trim()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTaskModal;
