import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const TrustBadges: React.FC = () => {
  return (
    <section className="trust-badges py-4 bg-light border-top border-bottom">
      <Container>
        <Row className="align-items-center justify-content-center text-center">
          <Col xs={6} md={2} className="mb-3 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-shield-check text-success fs-1 mb-2"></i>
              <span className="small text-muted">256-bit SSL Encryption</span>
            </div>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-patch-check-fill text-primary fs-1 mb-2"></i>
              <span className="small text-muted">Verified Business</span>
            </div>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-lock-fill text-dark fs-1 mb-2"></i>
              <span className="small text-muted">Data Protection</span>
            </div>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-people-fill text-info fs-1 mb-2"></i>
              <span className="small text-muted">50,000+ Users</span>
            </div>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-award-fill text-warning fs-1 mb-2"></i>
              <span className="small text-muted">Best of 2023</span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TrustBadges; 