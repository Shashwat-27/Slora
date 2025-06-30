import React from 'react';
import { Container, Button } from 'react-bootstrap';

interface SecurityBannerProps {
  show?: boolean;
}

const SecurityBanner: React.FC<SecurityBannerProps> = ({ show = true }) => {
  if (!show) return null;
  
  return (
    <div className="bg-light py-1 border-bottom border-light">
      <Container className="d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-shield-check text-success me-1"></i>
          <span className="text-muted">
            <span className="fw-semibold">Secure</span>: End-to-end encrypted conversations.{' '}
            <Button 
              variant="link" 
              className="p-0" 
              style={{ fontSize: 'inherit', verticalAlign: 'baseline', color: '#6c757d' }}
              onClick={() => window.open('/security', '_blank')}
            >
              Learn more
            </Button>
          </span>
        </div>
      </Container>
    </div>
  );
};

export default SecurityBanner; 