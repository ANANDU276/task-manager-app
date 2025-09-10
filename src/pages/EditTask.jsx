import { Form, Button } from "react-bootstrap";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import TaskContext from "../context/TaskContext";
import { useContext } from "react";
import { motion } from "framer-motion";

function EditTask() {
  const { task, setShowAlert } = useOutletContext();
  const { editTask } = useContext(TaskContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  // Framer Motion variants
  const editVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim()) {
      editTask(task.id, title, description);
      setShowAlert(true);
      navigate(`/tasks/${task.id}`);
    }
  };

  return (
    <motion.div
      variants={editVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Form onSubmit={handleSave}>
        <h5 className="mb-3">Edit Task</h5>

        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button type="submit" variant="success">
            Save
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </Form>
    </motion.div>
  );
}

export default EditTask;
