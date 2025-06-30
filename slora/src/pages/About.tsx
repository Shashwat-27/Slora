import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Navigation from '../components/Navigation';

const About: React.FC = () => {
  return (
    <>
      <Navigation />
      <Container className="py-5">
        <Row className="mb-5">
          <Col>
            <h1 className="display-4 fw-bold mb-3">About Slora</h1>
            <p className="lead text-muted">
              We're building the future of virtual collaboration spaces
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={6} className="mb-4 mb-md-0">
            <h2 className="fw-bold mb-4">Our Mission</h2>
            <p className="mb-4">
              At Slora, we believe that meaningful connections shouldn't be limited by physical boundaries. 
              Our mission is to create virtual spaces where people can gather, collaborate, and grow together, 
              regardless of where they are in the world.
            </p>
            <p>
              Founded in 2019, we've grown from a small startup to a vibrant community of over 50,000 users 
              spanning across 150+ countries. We're dedicated to continuously improving our platform to better 
              serve our diverse and growing community.
            </p>
          </Col>
          <Col md={6}>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
              alt="Team Collaboration" 
              className="img-fluid rounded shadow-sm"
            />
          </Col>
        </Row>

        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold mb-4 text-center">Our Values</h2>
          </Col>
        </Row>

        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3 text-primary">
                  <i className="bi bi-people-fill fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Community First</h3>
                <p className="text-muted mb-0">
                  We prioritize building and nurturing communities where everyone feels welcome and valued.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3 text-primary">
                  <i className="bi bi-shield-lock-fill fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Trust & Safety</h3>
                <p className="text-muted mb-0">
                  We are committed to creating safe, secure environments through robust privacy features and transparent practices.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3 text-primary">
                  <i className="bi bi-lightning-fill fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Innovation</h3>
                <p className="text-muted mb-0">
                  We continuously push the boundaries of what's possible in virtual collaboration and connection.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold mb-4 text-center">Our Team</h2>
          </Col>
        </Row>

        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/41.jpg" 
                  alt="Michael Roberts" 
                  className="rounded-circle img-thumbnail mb-3"
                  width="120"
                  height="120"
                />
                <h4 className="fw-bold mb-1">Michael Roberts</h4>
                <p className="text-primary mb-3">Co-Founder & CEO</p>
                <p className="text-muted mb-3">
                  Previously led product at Meta, passionate about creating meaningful human connections.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="link" className="text-muted p-0">
                    <i className="bi bi-linkedin fs-5"></i>
                    <span className="visually-hidden">LinkedIn profile</span>
                  </Button>
                  <Button variant="link" className="text-muted p-0">
                    <i className="bi bi-twitter fs-5"></i>
                    <span className="visually-hidden">Twitter profile</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Sara Williams" 
                  className="rounded-circle img-thumbnail mb-3"
                  width="120"
                  height="120"
                />
                <h4 className="fw-bold mb-1">Sara Williams</h4>
                <p className="text-primary mb-3">Co-Founder & CTO</p>
                <p className="text-muted mb-3">
                  Former Google engineer with expertise in scalable systems and real-time communication.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="link" className="text-muted p-0">
                    <i className="bi bi-linkedin fs-5"></i>
                    <span className="visually-hidden">LinkedIn profile</span>
                  </Button>
                  <Button variant="link" className="text-muted p-0">
                    <i className="bi bi-github fs-5"></i>
                    <span className="visually-hidden">GitHub profile</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Alex Johnson" 
                  className="rounded-circle img-thumbnail mb-3"
                  width="120"
                  height="120"
                />
                <h4 className="fw-bold mb-1">Alex Johnson</h4>
                <p className="text-primary mb-3">Head of Design</p>
                <p className="text-muted mb-3">
                  Award-winning UX designer focused on creating intuitive and beautiful user experiences.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="link" className="text-muted p-0">
                    <i className="bi bi-linkedin fs-5"></i>
                    <span className="visually-hidden">LinkedIn profile</span>
                  </Button>
                  <Button variant="link" className="text-muted p-0">
                    <i className="bi bi-dribbble fs-5"></i>
                    <span className="visually-hidden">Dribbble profile</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col className="text-center">
            <h3 className="fw-bold mb-4">Join Our Journey</h3>
            <p className="mb-4">
              We're always looking for talented individuals to join our team. Check out our open positions!
            </p>
            <Button variant="primary" className="px-4 py-2">View Open Positions</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About; 