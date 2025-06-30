import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light py-5 mt-auto">
      <Container>
        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
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
                  <div className="brand-name fw-bold">Slora</div>
                  <div className="brand-subtitle small text-muted">Virtual Rooms</div>
                </div>
              </div>
            </div>
            <p className="text-muted mb-3">
              Experience seamless collaboration in secure virtual rooms designed for teams, communities, and events.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" className="me-2 text-secondary" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://twitter.com" className="me-2 text-secondary" aria-label="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="https://instagram.com" className="me-2 text-secondary" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://linkedin.com" className="me-2 text-secondary" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Company</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/about" className="p-0 mb-2 text-secondary">About Us</Nav.Link>
              <Nav.Link as={Link} to="/careers" className="p-0 mb-2 text-secondary">Careers</Nav.Link>
              <Nav.Link as={Link} to="/blog" className="p-0 mb-2 text-secondary">Blog</Nav.Link>
              <Nav.Link as={Link} to="/press" className="p-0 mb-2 text-secondary">Press</Nav.Link>
            </Nav>
          </Col>

          <Col lg={2} md={6} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Resources</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/support" className="p-0 mb-2 text-secondary">Support</Nav.Link>
              <Nav.Link as={Link} to="/docs" className="p-0 mb-2 text-secondary">Documentation</Nav.Link>
              <Nav.Link as={Link} to="/privacy" className="p-0 mb-2 text-secondary">Privacy</Nav.Link>
              <Nav.Link as={Link} to="/terms" className="p-0 mb-2 text-secondary">Terms</Nav.Link>
            </Nav>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="fw-bold mb-3">Subscribe to our newsletter</h5>
            <p className="text-muted mb-3">Get the latest updates and news directly in your inbox.</p>
            <div className="input-group mb-3">
              <input type="email" className="form-control" placeholder="Your email address" aria-label="Email address" />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="text-muted mb-3 mb-md-0">
            © {currentYear} Slora. All rights reserved.
          </p>
          <div className="d-flex">
            <Nav.Link as={Link} to="/privacy" className="text-muted me-3">Privacy Policy</Nav.Link>
            <Nav.Link as={Link} to="/terms" className="text-muted me-3">Terms of Service</Nav.Link>
            <Nav.Link as={Link} to="/cookies" className="text-muted">Cookies Policy</Nav.Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 