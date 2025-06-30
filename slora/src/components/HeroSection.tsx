import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HeroSection.css';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="hero-section hero-classic">
      <div className="hero-bg-elements">
        <div className="hero-shape-1"></div>
        <div className="hero-shape-2"></div>
        <div className="hero-shape-3"></div>
      </div>
      
      <Container>
        <Row className="align-items-center hero-content">
          <Col lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
            <div>
              <div className="badge bg-primary-subtle text-primary px-3 py-2 mb-3 rounded-pill">
                <i className="bi bi-stars me-2"></i>
                Trusted by 50,000+ users worldwide
              </div>
              <h1 className="display-5 fw-bold mb-3">Connect, Collaborate, Create Together <span className="text-primary">Securely</span></h1>
              <p className="lead text-secondary mb-4">
                Experience seamless interaction in customized virtual environments designed for teams, communities, and events.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center justify-content-lg-start">
                <Button size="lg" variant="primary" className="px-4 py-2" onClick={handleGetStarted}>
                  {currentUser ? 'Go to Dashboard' : 'Get Started'}
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
                <Button size="lg" variant="outline-secondary" className="px-4 py-2" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  How It Works
                  <i className="bi bi-play-fill ms-2"></i>
                </Button>
              </div>
              
              <div className="trust-logos d-flex flex-wrap align-items-center mt-4 pt-3">
                <p className="text-muted mb-2 me-3 small text-uppercase fw-bold">Trusted by:</p>
                <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-lg-start">
                  <img src="https://cdn.worldvectorlogo.com/logos/slack-1.svg" alt="Slack" className="company-logo" />
                  <img src="https://cdn.worldvectorlogo.com/logos/microsoft-5.svg" alt="Microsoft" className="company-logo" />
                  <img src="https://cdn.worldvectorlogo.com/logos/ibm-1.svg" alt="IBM" className="company-logo" />
                  <img src="https://cdn.worldvectorlogo.com/logos/airbnb-1.svg" alt="Airbnb" className="company-logo" />
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={6} className="position-relative">
            <div className="classic-hero-image">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Collaborative meeting" 
                className="img-fluid rounded-4 shadow-lg" 
              />
              
              <div className="floating-icon floating-icon-1 bg-primary text-white">
                <i className="bi bi-camera-video-fill"></i>
              </div>
              <div className="floating-icon floating-icon-2 bg-success text-white">
                <i className="bi bi-chat-dots-fill"></i>
              </div>
              <div className="floating-icon floating-icon-3 bg-warning text-white">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection; 