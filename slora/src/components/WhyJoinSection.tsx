import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const WhyJoinSection: React.FC = () => {
  const benefits = [
    {
      id: 1,
      icon: 'bi-people-fill',
      color: 'primary',
      title: 'Active Community',
      description: 'Connect with motivated individuals who share your interests and goals.'
    },
    {
      id: 2,
      icon: 'bi-lightning-charge-fill',
      color: 'warning',
      title: 'Boost Productivity',
      description: 'Stay focused and accomplish more through accountability and group momentum.'
    },
    {
      id: 3,
      icon: 'bi-graph-up',
      color: 'success',
      title: 'Track Progress',
      description: 'Monitor your growth and celebrate achievements with community support.'
    },
    {
      id: 4,
      icon: 'bi-shield-check',
      color: 'info',
      title: 'Safe Environment',
      description: 'All rooms are moderated to ensure a positive and supportive experience.'
    },
    {
      id: 5,
      icon: 'bi-calendar-event',
      color: 'danger',
      title: 'Regular Events',
      description: 'Participate in scheduled sessions to build consistency in your routine.'
    },
    {
      id: 6,
      icon: 'bi-chat-dots-fill',
      color: 'secondary',
      title: 'Expert Guidance',
      description: 'Learn from knowledgeable peers and mentors in specialized topics.'
    }
  ];

  return (
    <section id="features" className="why-join-section py-5">
      <Container>
        <div className="text-center mb-5">
          <span className="text-primary fw-semibold mb-2 d-block">BENEFITS</span>
          <h2 className="display-5 fw-bold mb-3">Why Join Slora?</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Discover the advantages of our virtual community spaces designed to help you grow personally and professionally.
          </p>
        </div>

        <Row className="g-4">
          {benefits.map(benefit => (
            <Col key={benefit.id} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="p-4">
                  <div className={`icon-box mb-4 rounded-circle bg-${benefit.color} bg-opacity-10 d-inline-flex justify-content-center align-items-center`} 
                    style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${benefit.icon} fs-4 text-${benefit.color}`}></i>
                  </div>
                  <h4 className="fw-bold h5 mb-3">{benefit.title}</h4>
                  <p className="text-muted mb-0">{benefit.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5 pt-4">
          <div className="p-4 bg-light rounded-4 d-inline-block">
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-4">
              <div className="text-center px-3">
                <div className="display-5 fw-bold text-primary">50K+</div>
                <p className="text-muted mb-0">Active Users</p>
              </div>
              <div className="vr d-none d-md-block" style={{ height: '50px' }}></div>
              <div className="text-center px-3">
                <div className="display-5 fw-bold text-primary">1200+</div>
                <p className="text-muted mb-0">Virtual Rooms</p>
              </div>
              <div className="vr d-none d-md-block" style={{ height: '50px' }}></div>
              <div className="text-center px-3">
                <div className="display-5 fw-bold text-primary">94%</div>
                <p className="text-muted mb-0">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyJoinSection; 