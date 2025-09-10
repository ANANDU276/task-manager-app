import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import TaskContext from "../context/TaskContext";
import { motion } from "framer-motion";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks } = useContext(TaskContext);

  const task = tasks.find((t) => t.id === Number(id));
  const [showAlert, setShowAlert] = useState(false);

  // Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Mount / Unmount logs
  useEffect(() => {
    console.log(`TaskDetails mounted for task ${id}`);
    return () => {
      console.log(`TaskDetails unmounted for task ${id}`);
    };
  }, [id]);

  if (!task) return <p className="text-center">Task not found</p>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="p-4 shadow-lg rounded-4">
              <h2 className="mb-3">Task Details</h2>

              <div className="d-flex justify-content-between text-muted small mb-3">
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                <span>
                  {new Date(task.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span className={task.completed ? "text-success" : "text-warning"}>
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </p>
               <h5 className="mb-3">
                <strong>Title:</strong> {task.title || "No Title"}
              </h5>

              <p className="mb-3">
                <strong>Description:</strong> {task.description || "No description"}
              </p>

              {showAlert && (
                <Alert variant="success" className="py-2">
                  Task updated successfully!
                </Alert>
              )}

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="primary"
                  onClick={() => navigate("edit")}
                  disabled={location.pathname.endsWith("/edit")}
                >
                  Edit
                </Button>
                <Button variant="secondary" onClick={() => navigate("/tasks")}>
                  Back
                </Button>
              </div>

              {/* Nested route renders here */}
              <div className="mt-4 border-top pt-3">
                <Outlet context={{ task, setShowAlert }} />
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskDetails;
