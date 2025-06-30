import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const VerificationBadge: React.FC = () => {
  return (
    <Card className="border-0 shadow-sm mt-4">
      <Card.Body className="p-3">
        <Row className="align-items-center">
          <Col xs={2} className="text-center">
            <i className="bi bi-shield-lock-fill text-success fs-1"></i>
          </Col>
          <Col xs={10}>
            <h6 className="mb-1">Secure & Verified</h6>
            <p className="text-muted small mb-0">
              Your data is protected with enterprise-grade encryption. 
              Slora is verified by <span className="fw-bold">TrustGuard</span> and complies with industry security standards.
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VerificationBadge; 