import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutSection: React.FC = () => {
  return (
    <div id="about" className="about-section py-4">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="position-relative">
              <div className="about-image-grid">
                <div className="row g-3">
                  <div className="col-6">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                      alt="Team collaboration" 
                      className="img-fluid rounded-4 shadow"
                    />
                  </div>
                  <div className="col-6">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                      alt="Virtual meeting" 
                      className="img-fluid rounded-4 shadow"
                    />
                  </div>
                  <div className="col-12">
                    <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80" 
                      alt="Team members" 
                      className="img-fluid rounded-4 shadow"
                    />
                  </div>
                </div>
              </div>
              
              <div className="position-absolute top-0 start-0 translate-middle bg-primary rounded-4 p-4 shadow-lg d-none d-lg-block" style={{ zIndex: 2 }}>
                <div className="text-white text-center">
                  <h4 className="fw-bold mb-0">2019</h4>
                  <p className="mb-0">Founded</p>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="ps-lg-5">
              <span className="text-primary fw-semibold mb-1 d-block">OUR STORY</span>
              <h2 className="display-5 fw-bold mb-3">About Slora</h2>
              <p className="lead mb-3">
                Slora was founded in 2019 with a simple mission: to create virtual spaces where people could connect, collaborate, and grow together.
              </p>
              <p className="mb-3">
                Our founder, Sarah Johnson, recognized the challenges of isolation and lack of accountability that many people face when pursuing personal and professional growth. She envisioned a platform that would bring together like-minded individuals in topic-focused virtual rooms, creating communities of support and shared purpose.
              </p>
              <p className="mb-3">
                Today, Slora hosts thousands of active rooms across diverse categories, from professional skills development to creative pursuits, wellness practices, and academic studies. Our community spans the globe, with members from over 150 countries.
              </p>
              <div className="d-flex flex-wrap gap-4 mt-3">
                <div>
                  <h3 className="display-5 fw-bold text-primary mb-0">150+</h3>
                  <p className="text-muted">Countries</p>
                </div>
                <div>
                  <h3 className="display-5 fw-bold text-primary mb-0">50K+</h3>
                  <p className="text-muted">Active Users</p>
                </div>
                <div>
                  <h3 className="display-5 fw-bold text-primary mb-0">1200+</h3>
                  <p className="text-muted">Virtual Rooms</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutSection; 