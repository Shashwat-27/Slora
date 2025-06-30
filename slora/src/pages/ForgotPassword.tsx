import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { resetPassword, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="background-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>
      </div>
      
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <Card className="login-card shadow">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="brand-icon mx-auto mb-3">
                    <div className="circle-icon"></div>
                  </div>
                  <h2 className="fw-bold">Reset Password</h2>
                  <p className="text-muted">
                    Enter your email and we'll send you instructions to reset your password
                  </p>
                </div>
                
                {success ? (
                  <Alert variant="success">
                    <p className="mb-0">
                      Password reset instructions have been sent to <strong>{email}</strong>.<br/>
                      Please check your email inbox.
                    </p>
                  </Alert>
                ) : (
                  <>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-4 form-floating">
                        <Form.Control
                          type="email"
                          id="emailInput"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <Form.Label htmlFor="emailInput">Email address</Form.Label>
                      </Form.Group>
                      
                      <div className="d-grid gap-2 mb-4">
                        <Button 
                          variant="primary" 
                          type="submit" 
                          size="lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending Instructions...
                            </>
                          ) : (
                            'Reset Password'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
                
                <div className="text-center">
                  <p className="mb-0">
                    <Link to="/login" className="text-decoration-none">
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Login
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword; 