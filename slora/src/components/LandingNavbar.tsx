import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

  const handleSignUpClick = () => {
    navigate('/login', { state: { signup: true } });
    window.scrollTo(0, 0);
  };
  
  const handleDashboardClick = () => {
    navigate('/dashboard');
    window.scrollTo(0, 0);
  };

  return (
    <Navbar 
      bg="white" 
      variant="light" 
      expand="lg" 
      fixed="top" 
      className="py-1 shadow-sm"
    >
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand 
          onClick={() => window.location.href='#'} 
          className="d-flex align-items-center" 
          style={{ cursor: 'pointer' }}
        >
          <div className="me-2">
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5Z" fill="url(#paint0_linear)" />
              <path d="M40 25C40 30.5 35.5 35 30 35C24.5 35 20 30.5 20 25C20 19.5 24.5 15 30 15C35.5 15 40 19.5 40 25Z" fill="white" />
              <path d="M46 42C46 44.8 41.2 50 30 50C18.8 50 14 44.8 14 42C14 36.5 21.2 32 30 32C38.8 32 46 36.5 46 42Z" fill="white" fillOpacity="0.9" />
              <defs>
                <linearGradient id="paint0_linear" x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-name" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Slora</div>
            <div className="brand-subtitle" style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '-3px' }}>Virtual Rooms</div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#why-join" className="px-2">Why Join</Nav.Link>
            <Nav.Link href="#how-it-works" className="px-2">How It Works</Nav.Link>
            <Nav.Link href="#pricing" className="px-2">Pricing</Nav.Link>
            <Nav.Link href="#reviews" className="px-2">Reviews</Nav.Link>
            <Nav.Link href="#about" className="px-2">About</Nav.Link>
            <Nav.Link href="#blog" className="px-2">Blog</Nav.Link>
          </Nav>
          <div className="d-none d-lg-flex ms-lg-3">
            {currentUser ? (
              <Button 
                variant="primary" 
                className="px-3 py-1"
                onClick={handleDashboardClick}
              >
                <i className="bi bi-grid me-1"></i>
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline-primary" 
                  className="me-2 px-3 py-1"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  className="px-3 py-1"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LandingNavbar; 