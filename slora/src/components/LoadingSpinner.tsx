import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner: React.FC = () => {
  return (
    <Container className="loading-container d-flex justify-content-center align-items-center">
      <div className="text-center">
        <Spinner animation="border" variant="primary" role="status" className="mb-2" />
        <p className="text-muted">Loading...</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner; 