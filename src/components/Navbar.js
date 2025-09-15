import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown, Badge } from "react-bootstrap";
import { FaUser, FaHeart, FaSignOutAlt, FaHome, FaFilm, FaFire, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

function NavigationBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar className="navbar-custom" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🎬 MovieReview
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/movies" className="d-flex align-items-center">
              <FaFilm className="me-1" />
              Browse Movies
            </Nav.Link>
            <Nav.Link as={Link} to="/trending" className="d-flex align-items-center">
              <FaFire className="me-1" />
              Trending
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center me-3">
                  <FaUser className="me-1" />
                  Profile
                </Nav.Link>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-primary" className="btn-custom">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=667eea&color=fff&size=32`}
                      alt="Profile"
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px' }}
                    />
                    {user.username}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      <FaUser className="me-2" />
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile" onClick={() => {
                      // Switch to watchlist tab
                      const event = new CustomEvent('switchTab', { detail: 'watchlist' });
                      window.dispatchEvent(event);
                    }}>
                      <FaHeart className="me-2" />
                      My Watchlist
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn-custom btn-outline-primary me-2">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn-custom btn-primary-custom">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
