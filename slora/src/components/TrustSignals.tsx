import React from 'react';
import { Alert, Row, Col, Button } from 'react-bootstrap';

interface TrustSignalsProps {
  variant?: 'primary' | 'success' | 'info';
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ variant = 'info' }) => {
  return (
    <Alert variant={variant} className="border-0 d-flex align-items-center py-2 px-3 mb-4">
      <Row className="w-100 align-items-center">
        <Col xs={12} md="auto" className="me-md-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-shield-check me-2 fs-5"></i>
            <span className="fw-medium">Verified Safe Environment</span>
          </div>
        </Col>
        
        <Col xs={12} md className="mt-2 mt-md-0">
          <small>
            All rooms are actively moderated to ensure a positive experience.
            <Button variant="link" className="ms-1 p-0 text-decoration-none">Learn more</Button>
          </small>
        </Col>
      </Row>
    </Alert>
  );
};

export default TrustSignals; 