import { Card, Button, Badge, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaRegCircle, FaStar, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

function TaskCard({ 
  task, 
  onToggle, 
  onToggleImportant, 
  onEdit, 
  onDelete,
  variants 
}) {
  const navigate = useNavigate();

  return (
    <Col xs={12} md={6} lg={3}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
      >
        <Card
          className={`shadow-sm task-card ${task.completed ? "completed-task" : ""}`}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => navigate(`/tasks/${task.id}`)}
        >
          <Card.Header className="d-flex justify-content-between align-items-center p-2 p-md-3">
            <div
              className="d-flex align-items-center gap-2"
              style={{ minWidth: 0, flex: 1 }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(task.id);
                }}
              >
                {task.completed ? (
                  <FaCheckCircle
                    color="green"
                    style={{ fontSize: "1.2rem", flexShrink: 0 }}
                  />
                ) : (
                  <FaRegCircle
                    color="gray"
                    style={{ fontSize: "1.2rem", flexShrink: 0 }}
                  />
                )}
              </div>
              <div
                title={task.title}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <strong>{task.title}</strong>
              </div>
            </div>
            <Button
              variant="link"
              className="p-0 ms-2"
              onClick={(e) => {
                e.stopPropagation();
                onToggleImportant(task.id);
              }}
              title={task.important ? "Unmark Important" : "Mark Important"}
            >
              {task.important ? (
                <FaStar color="#ffc107" />
              ) : (
                <FaRegStar color="#ccc" />
              )}
            </Button>
          </Card.Header>
          <Card.Body className="p-2 p-md-3">
            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              <span>
                {new Date(task.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {task.description && (
              <Card.Text className="mb-2">
                {task.description.split(" ").slice(0, 15).join(" ")}
                {task.description.split(" ").length > 15 && " ..."}
              </Card.Text>
            )}
            <div className="button-group d-flex flex-wrap gap-1">
              <Button
                variant="outline-primary"
                size="sm"
                className="flex-grow-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="flex-grow-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                Delete
              </Button>
              <Button
                variant={task.completed ? "success" : "secondary"}
                size="sm"
                className="flex-grow-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(task.id);
                }}
              >
                {task.completed ? "Undo" : "Done"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Col>
  );
}

export default TaskCard;