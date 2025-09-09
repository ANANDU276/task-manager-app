import {
  Navbar as RBNavbar,
  Nav,
  Container,
  Button,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import { Sun, Moon, BoxArrowRight } from "react-bootstrap-icons";

function Navbar() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <RBNavbar
        bg={theme}
        data-bs-theme={theme}
        expand="lg"
        className="shadow-sm fixed-top"
        style={{ zIndex: 1030 }}
      >
        <Container>
          {/* Brand */}
          <RBNavbar.Brand as={Link} to="/" className="fw-bold">
            Task Manager
          </RBNavbar.Brand>

          {/* Mobile toggle */}
          <RBNavbar.Toggle aria-controls="main-navbar" className="border-0" />
          <RBNavbar.Collapse id="main-navbar">
            {/* Left links */}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              {isAuthenticated && (
                <Nav.Link as={Link} to="/tasks">
                  Tasks
                </Nav.Link>
              )}
            </Nav>

            {/* Right controls */}
            <div className="d-flex align-items-center gap-2">
              {/* Theme toggle */}
              <Button
                variant={theme === "dark" ? "outline-light" : "outline-dark"}
                size="sm"
                className="rounded-circle d-flex align-items-center justify-content-center p-2"
                onClick={toggleTheme}
                title={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              {isAuthenticated ? (
                <>
                  {/* User Avatar */}
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: theme === "dark" ? "#6c757d" : "#e9ecef",
                      color: theme === "dark" ? "#fff" : "#000",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                    title={user.email}
                  >
                    {getUserInitials()}
                  </div>

                  {/* Logout button */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <BoxArrowRight className="me-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button as={Link} to="/login" variant="primary" size="sm">
                  Login
                </Button>
              )}
            </div>
          </RBNavbar.Collapse>
        </Container>
      </RBNavbar>

      {/* Spacer to avoid overlap */}
      <div style={{ paddingTop: "70px" }} />

      {/* Logout Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Navbar;
