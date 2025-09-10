import { useContext, useEffect, useState } from "react";
import { Card, Button, Spinner, Form, Row, Col, Modal } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaBars, FaFilter } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import TaskContext from "../context/TaskContext";
import EditTaskModal from "../components/EditTaskModal";
import TaskCard from "../components/TaskCard";
import "../styles/Tasks.scss";

function Tasks() {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    toggleImportant,
    deleteAllTasks,
  } = useContext(TaskContext);

  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImportant, setNewImportant] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalTask, setModalTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();
  const statusFilter = searchParams.get("status") || "all";
  const searchQuery = searchParams.get("q") || "";

  // Lifecycle: Mount / Unmount
  useEffect(() => {
    console.log("TaskList mounted");

    if (tasks.length === 0) fetchTasks();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowSidebar(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      console.log("TaskList unmounted");
    };
  }, []);

  // Lifecycle: Tasks update
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Tasks updated");
    }
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    addTask({
      id: Date.now(),
      title: newTask,
      description: newDescription,
      completed: false,
      important: newImportant,
      createdAt: Date.now(),
    });

    setNewTask("");
    setNewDescription("");
    setNewImportant(false);
    if (isMobile) setShowSidebar(false);
  };

  const handleEditTask = (task) => {
    setModalTask(task);
    setShowModal(true);
  };

  const handleSaveTask = (title, description) => {
    editTask(modalTask.id, title, description);
    setShowModal(false);
  };

  const confirmDeleteTask = (id) => {
    setDeleteTaskId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    deleteTask(deleteTaskId);
    setShowDeleteModal(false);
  };

  const handleDeleteAllConfirmed = () => {
    deleteAllTasks();
    setShowDeleteAllModal(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "completed" && !task.completed) return false;
    if (statusFilter === "pending" && task.completed) return false;
    if (statusFilter === "important" && !task.important) return false;
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const pendingTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <div className="tasks-page">
      {/* Mobile Header */}
      {isMobile && (
        <div className="d-flex justify-content-between align-items-center mb-3 sticky-top p-3  shadow-sm">
          <h4 className="mb-0">My Tasks</h4>
          <Button
            variant="outline-primary"
            onClick={() => setShowSidebar(!showSidebar)}
            className="d-flex align-items-center gap-1"
          >
            <FaBars /> {showSidebar ? "Hide" : "Show"} Menu
          </Button>
        </div>
      )}

      <Row className="g-3">
        {/* Sidebar */}
        <Col
          xs={12}
          md={4}
          lg={3}
          className={isMobile ? (showSidebar ? "" : "d-none") : ""}
        >
          <Card className="p-3 sidebar-card shadow-sm mb-3">
            <h4 className="mb-3">Add Task</h4>
            <Form onSubmit={handleAddTask} className="d-flex flex-column">
              <Form.Control
                type="text"
                placeholder="Task title"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="mb-2"
              />
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mb-2"
              />
              <Form.Check
                type="checkbox"
                label="Mark as Important"
                className="mb-2"
                checked={newImportant}
                onChange={(e) => setNewImportant(e.target.checked)}
              />
              <Button
                type="submit"
                className="mt-2"
                disabled={!newTask.trim()}
                variant="primary"
              >
                Add Task
              </Button>
            </Form>

            <hr />
            <h5 className="mb-2 d-flex align-items-center">
              <FaFilter className="me-2" /> Filter
            </h5>
            <Form.Select
              value={statusFilter}
              onChange={(e) =>
                setSearchParams({ status: e.target.value, q: searchQuery })
              }
              className="mb-3"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="important">Important</option>
            </Form.Select>

            <h5 className="mb-2">Search</h5>
            <Form.Control
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) =>
                setSearchParams({ status: statusFilter, q: e.target.value })
              }
              className="mb-3"
            />

            <Button
              variant="outline-danger"
              className="mt-3"
              disabled={tasks.length === 0}
              onClick={() => setShowDeleteAllModal(true)}
            >
              Delete All Tasks
            </Button>
          </Card>

          {/* Task Summary */}
          <Card className="p-3 sidebar-card shadow-sm">
            <h5 className="mb-3">Task Summary</h5>
            <div className="summary-list">
              {[
                { label: "Total Tasks", value: tasks.length },
                {
                  label: "Pending",
                  value: tasks.filter((t) => !t.completed).length,
                },
                {
                  label: "Completed",
                  value: tasks.filter((t) => t.completed).length,
                },
                {
                  label: "Important",
                  value: tasks.filter((t) => t.important).length,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="summary-item d-flex justify-content-between py-2 border-bottom"
                >
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Task List */}
        <Col xs={12} md={8} lg={9}>
          {loading && (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && filteredTasks.length === 0 ? (
            <div className="text-center my-5 text-muted">
              {tasks.length === 0 ? (
                <>
                  <h5>No tasks yet</h5>
                  <p>Add your first task to get started</p>
                </>
              ) : (
                <>
                  <h5>No tasks found</h5>
                  <p>Try changing your filters or add a new task</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-3 d-flex align-items-center">
                    Pending Tasks {pendingTasks.length}
                  </h4>
                  <Row className="g-3">
                    <AnimatePresence>
                      {pendingTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onToggleImportant={toggleImportant}
                          onEdit={handleEditTask}
                          onDelete={confirmDeleteTask}
                          variants={taskVariants}
                        />
                      ))}
                    </AnimatePresence>
                  </Row>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-3 d-flex align-items-center">
                    Completed Tasks {completedTasks.length}
                  </h4>
                  <Row className="g-3">
                    <AnimatePresence>
                      {completedTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onToggleImportant={toggleImportant}
                          onEdit={handleEditTask}
                          onDelete={confirmDeleteTask}
                          variants={taskVariants}
                        />
                      ))}
                    </AnimatePresence>
                  </Row>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Edit Modal */}
      {modalTask && (
        <EditTaskModal
          show={showModal}
          task={modalTask}
          handleClose={() => setShowModal(false)}
          handleSave={handleSaveTask}
        />
      )}

      {/* Delete Single Task Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete All Tasks Modal */}
      <Modal
        show={showDeleteAllModal}
        onHide={() => setShowDeleteAllModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete All</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete all tasks? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteAllModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAllConfirmed}>
            Delete All
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Tasks;
