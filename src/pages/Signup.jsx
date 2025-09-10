import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.username && form.email && form.password) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some((u) => u.email === form.email);

      if (userExists) {
        setError("Email already registered");
        return;
      }

      signup(form);
      navigate("/tasks");
    } else {
      setError("All fields are required");
    }
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Alert animation
  const alertVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="shadow-lg p-5 rounded-4 border-0">
              <h2 className="text-center mb-4">Signup</h2>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="alert"
                    variants={alertVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Alert
                      variant="danger"
                      onClose={() => setError("")}
                      dismissible
                      className="mb-3"
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    placeholder="Enter username"
                    className="py-2"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Enter email"
                    className="py-2"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Password"
                    className="py-2"
                  />
                </Form.Group>
                <Button
                  variant="success"
                  type="submit"
                  className="w-100 py-2 fw-bold"
                >
                  Signup
                </Button>
              </Form>
              <p className="text-center mt-3 text-muted">
                Already have an account?{" "}
                <a href="/login" className="text-decoration-none">
                  Login
                </a>
              </p>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;
