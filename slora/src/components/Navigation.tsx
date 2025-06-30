import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Image } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  
  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle navigation programmatically to avoid type errors with NavDropdown
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // Handle going to signup page
  const goToSignup = () => {
    navigate('/login', { state: { signup: true } });
  };
  
  // Handle login navigation
  const goToLogin = () => {
    navigate('/login');
  };
  
  // Handle logout and navigate to home
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  // Get user display name (or fallback to email or 'User')
  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    
    if (currentUser?.email) {
      const emailName = currentUser.email.split('@')[0];
      // Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'User';
  };
  
  return (
    <Navbar
      expand="lg"
      fixed="top"
      bg={scrolled ? 'white' : 'transparent'}
      className={`navigation-bar py-2 ${scrolled ? 'scrolled shadow-sm' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <div className="brand-icon me-2">
            <div className="circle-icon"></div>
          </div>
          <span className="fw-bold">Slora</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className="nav-link-hover">Home</Nav.Link>
            {currentUser && (
              <Nav.Link as={NavLink} to="/dashboard" className="nav-link-hover">Dashboard</Nav.Link>
            )}
            <Nav.Link href="#features" className="nav-link-hover">Features</Nav.Link>
            <Nav.Link href="#pricing" className="nav-link-hover">Pricing</Nav.Link>
            <Nav.Link href="#about" className="nav-link-hover">About</Nav.Link>
          </Nav>
          
          <Nav>
            {currentUser ? (
              <div className="d-flex align-items-center">
                <NavDropdown 
                  title={
                    <div className="user-dropdown-toggle d-flex align-items-center">
                      <div className="avatar-container me-2">
                        <Image 
                          src={currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                          alt="User Avatar" 
                          roundedCircle 
                          className="user-avatar" 
                        />
                      </div>
                      <span className="user-name">{getUserDisplayName()}</span>
                    </div>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item onClick={() => navigateTo('/profile')}>
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateTo('/dashboard')}>
                    <i className="bi bi-grid me-2"></i>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateTo('/settings')}>
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={goToLogin}
                >
                  Log In
                </Button>
                <Button 
                  variant="primary"
                  onClick={goToSignup}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 