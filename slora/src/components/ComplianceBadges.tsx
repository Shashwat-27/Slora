import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ComplianceBadges: React.FC = () => {
  return (
    <section className="compliance-badges py-4 bg-white">
      <Container>
        <Row className="justify-content-center text-center">
          <Col xs={12}>
            <h5 className="mb-4 text-muted">Regulatory Compliance & Certifications</h5>
          </Col>
        </Row>
        <Row className="justify-content-center align-items-center">
          <Col xs={6} md={2} className="mb-3 mb-md-0 text-center">
            <div className="badge-icon rounded-circle bg-light p-2 d-inline-flex justify-content-center align-items-center mb-2" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-shield-check text-primary fs-2"></i>
            </div>
            <p className="small mb-0">GDPR Compliant</p>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0 text-center">
            <div className="badge-icon rounded-circle bg-light p-2 d-inline-flex justify-content-center align-items-center mb-2" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-lock text-success fs-2"></i>
            </div>
            <p className="small mb-0">SOC 2 Certified</p>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0 text-center">
            <div className="badge-icon rounded-circle bg-light p-2 d-inline-flex justify-content-center align-items-center mb-2" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-credit-card text-info fs-2"></i>
            </div>
            <p className="small mb-0">PCI DSS Compliant</p>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0 text-center">
            <div className="badge-icon rounded-circle bg-light p-2 d-inline-flex justify-content-center align-items-center mb-2" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-fingerprint text-dark fs-2"></i>
            </div>
            <p className="small mb-0">ISO 27001 Certified</p>
          </Col>
          
          <Col xs={6} md={2} className="mb-3 mb-md-0 text-center">
            <div className="badge-icon rounded-circle bg-light p-2 d-inline-flex justify-content-center align-items-center mb-2" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-check2-circle text-warning fs-2"></i>
            </div>
            <p className="small mb-0">HIPAA Compliant</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ComplianceBadges; 