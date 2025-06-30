import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound: React.FC = () => {
  const { currentUser } = useAuth();
  const redirectPath = currentUser ? '/dashboard' : '/';

  return (
    <Container className="not-found-container py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="not-found-content">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead mb-5">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to={redirectPath}>
              <Button variant="primary" size="lg">
                <i className="bi bi-house-door me-2"></i>
                Go to {currentUser ? 'Dashboard' : 'Home'}
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound; 