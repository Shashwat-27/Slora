import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const steps = [
    {
      id: 1,
      icon: 'bi-person-plus',
      title: 'Create Your Profile',
      description: 'Sign up and personalize your profile with your interests, goals, and expertise.',
      image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80',
      bgColor: 'rgba(79, 70, 229, 0.1)',
      iconColor: '#4F46E5'
    },
    {
      id: 2,
      icon: 'bi-search',
      title: 'Discover Rooms',
      description: 'Browse and filter virtual rooms based on topics that interest you.',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80',
      bgColor: 'rgba(14, 165, 233, 0.1)',
      iconColor: '#0EA5E9'
    },
    {
      id: 3,
      icon: 'bi-people',
      title: 'Join Communities',
      description: 'Enter rooms and connect with like-minded individuals.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      iconColor: '#F59E0B'
    },
    {
      id: 4,
      icon: 'bi-camera-video',
      title: 'Collaborate Live',
      description: 'Participate in video calls, share screens, and work together in real-time.',
      image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10B981'
    }
  ];

  return (
    <div id="how-it-works" className="how-it-works-section py-4">
      {/* Decorative circles */}
      <div className="position-absolute rounded-circle" style={{ 
        width: '300px', 
        height: '300px', 
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0) 70%)',
        top: '5%',
        right: '-150px',
        zIndex: 0
      }}></div>
      <div className="position-absolute rounded-circle" style={{ 
        width: '200px', 
        height: '200px', 
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
        bottom: '15%',
        left: '-100px',
        zIndex: 0
      }}></div>

      <Container className="position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-4">
          <div className="d-inline-block bg-primary bg-opacity-10 px-3 py-1 rounded-pill mb-2">
            <span className="text-primary fw-semibold small">HOW IT WORKS</span>
          </div>
          <h2 className="display-5 fw-bold mb-2">Simple Steps to Get Started</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Begin your journey of growth and connection in just a few easy steps.
          </p>
        </div>

        <div className="position-relative mb-2">
          {/* Progress line */}
          <div className="position-absolute top-0 start-50 translate-middle-x d-none d-md-block" 
            style={{ 
              height: '100%', 
              width: '3px', 
              background: 'linear-gradient(to bottom, rgba(79, 70, 229, 0.3), rgba(16, 185, 129, 0.3))', 
              zIndex: 1 
            }}>
          </div>

          {steps.map((step, index) => (
            <Row key={step.id} className={`mb-2 align-items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
              <Col md={5} className={index % 2 === 0 ? 'text-md-end' : 'text-md-start'}>
                <div className={`pe-md-5 ps-md-5 ${index % 2 === 0 ? 'me-md-4' : 'ms-md-4'}`}>
                  <div className="mb-2">
                    <span className="badge rounded-pill px-3 py-2 mb-1" style={{ 
                      background: step.bgColor, 
                      color: step.iconColor 
                    }}>Step {step.id}</span>
                    <h3 className="h4 fw-bold mb-2">{step.title}</h3>
                    <p className="text-muted mb-0">{step.description}</p>
                  </div>
                </div>
              </Col>
              
              <Col md={2} className="text-center position-relative">
                <div className="step-icon rounded-circle d-inline-flex justify-content-center align-items-center shadow-sm position-relative" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'white',
                    border: `2px solid ${step.iconColor}`,
                    zIndex: 2 
                  }}>
                  <i className={`bi ${step.icon} fs-1`} style={{ color: step.iconColor }}></i>
                </div>
                {index < steps.length - 1 && (
                  <div className="position-absolute top-100 start-50 translate-middle-x d-none d-md-block" 
                    style={{ marginTop: '-20px', zIndex: 0 }}>
                    <i className="bi bi-chevron-down fs-3" style={{ color: step.iconColor }}></i>
                  </div>
                )}
              </Col>
              
              <Col md={5}>
                <div className="ps-md-5 pe-md-5 d-flex align-items-center justify-content-center h-100">
                  <div className="step-image rounded-4 overflow-hidden shadow img-hover-zoom position-relative">
                    {/* Color overlay */}
                    <div className="position-absolute top-0 end-0 bottom-0 start-0" 
                      style={{ 
                        background: `linear-gradient(45deg, ${step.bgColor} 0%, rgba(255,255,255,0) 60%)`,
                        zIndex: 1
                      }}>
                    </div>
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="img-fluid position-relative"
                      style={{ zIndex: 0 }}
                      width="400"
                    />
                    {/* Step number in corner */}
                    <div className="position-absolute top-0 start-0 m-3 rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        background: 'white',
                        color: step.iconColor,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        zIndex: 2
                      }}>
                      {step.id}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </div>

        <div className="text-center mt-3">
          <p className="lead fw-bold mb-3">Ready to get started?</p>
          <Button 
            variant="primary" 
            size="lg" 
            className="px-4 py-2 rounded-pill shadow-sm me-2"
            onClick={() => navigate('/login')}
          >
            <i className="bi bi-rocket-takeoff me-2"></i>
            Join Now
          </Button>
          <Button 
            variant="outline-primary" 
            size="lg" 
            className="px-4 py-2 rounded-pill shadow-sm"
            onClick={() => scrollToSection('why-join')}
          >
            <i className="bi bi-info-circle me-2"></i>
            Learn More
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default HowItWorksSection; 