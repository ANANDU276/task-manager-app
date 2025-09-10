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

// React Icons
import {
  FaHome,
  FaTasks,
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Sun, Moon } from "react-bootstrap-icons"; 
import LogoLight from "../assets/LOGO light.png";
import LogoDark from "../assets/LOGO dark.png";

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
          {/* Brand with Logo */}
          <RBNavbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center fw-bold gap-2"
          >
            {theme === "dark" ? (
              <img
                src={LogoLight}
                alt="Logo"
                width="32"
                height="32"
                className="d-inline-block align-top"
              />
            ) : (
              <img
                src={LogoDark}
                alt="Logo"
                width="32"
                height="32"
                className="d-inline-block align-top"
              />
            )}
            Task Manager
          </RBNavbar.Brand>

          {/* Mobile toggle */}
          <RBNavbar.Toggle aria-controls="main-navbar" className="border-0" />
          <RBNavbar.Collapse id="main-navbar">
            {/* Centered Nav Links */}
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                to="/"
                className="d-flex align-items-center gap-1"
              >
                <FaHome /> Home
              </Nav.Link>
              {isAuthenticated && (
                <Nav.Link
                  as={Link}
                  to="/tasks"
                  className="d-flex align-items-center gap-1"
                >
                  <FaTasks /> Tasks
                </Nav.Link>
              )}
            </Nav>

            {/* Right Controls */}
            <div className="d-flex align-items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* User Avatar */}
                  <div
                    className="d-flex align-items-center justify-content-center border rounded px-2 py-1"
                    style={{
                      minWidth: "45px",
                      backgroundColor: theme === "dark" ? "#333333ff" : "#e9ecef",
                      color: theme === "dark" ? "#fff" : "#000",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                    title={user.email}
                  >
                    <FaUserCircle className="me-1" /> {getUserInitials()}
                  </div>

                  {/* Logout button */}
                  <Button
                    variant={
                      theme === "dark" ? "outline-light" : "outline-dark"
                    }
                    size="sm"
                    className="d-flex align-items-center gap-1 border rounded px-3"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <FaSignOutAlt /> Logout
                  </Button>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  variant={theme === "dark" ? "outline-light" : "primary"}
                  size="sm"
                  className="d-flex align-items-center gap-1 border rounded px-3"
                >
                  <FaSignInAlt /> Login
                </Button>
              )}

              {/* Theme toggle (at the end) */}
              <Button
                variant={theme === "dark" ? "outline-light" : "outline-dark"}
                size="sm"
                className="d-flex align-items-center gap-1 border rounded px-3"
                onClick={toggleTheme}
                title={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>
          </RBNavbar.Collapse>
        </Container>
      </RBNavbar>

      {/* Spacer */}
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
