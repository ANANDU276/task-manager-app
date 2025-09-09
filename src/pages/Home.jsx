import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";

function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
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
            <Card className="shadow-lg p-5 rounded-4 text-center border-0">
              <h1 className="mb-3">Welcome to Task Manager</h1>
              <p className="lead text-muted mb-4">
                Organize your tasks easily and efficiently!
              </p>

              {!isAuthenticated ? (
                <>
                  <p className="text-muted mb-3">
                    Please login or sign up to access your tasks.
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <Button as={Link} to="/login" variant="primary">
                      Login
                    </Button>
                    <Button as={Link} to="/signup" variant="outline-primary">
                      Sign Up
                    </Button>
                  </div>
                </>
              ) : (
                <Button as={Link} to="/tasks" variant="success">
                  Go to My Tasks
                </Button>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
