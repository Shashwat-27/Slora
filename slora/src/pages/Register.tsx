import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import SecureBadge from '../components/SecureBadge';
import '../styles/Login.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
  
  // On component mount, scroll to top of page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Error handling function to convert Firebase error codes to user-friendly messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email format';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled';
      default:
        return errorCode || 'An error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setLoading(true);
      await signUp(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Extract error code from Firebase error
      const errorCode = err.code || '';
      setError(getErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google signin error:', err);
      
      // Extract error code from Firebase error
      const errorCode = err.code || '';
      setError(getErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };
  
  const navigateToLogin = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

  return (
    <div className="login-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="d-inline-block">
                    <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                      <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5Z" fill="url(#paint0_linear)" />
                      <path d="M40 25C40 30.5 35.5 35 30 35C24.5 35 20 30.5 20 25C20 19.5 24.5 15 30 15C35.5 15 40 19.5 40 25Z" fill="white" />
                      <path d="M46 42C46 44.8 41.2 50 30 50C18.8 50 14 44.8 14 42C14 36.5 21.2 32 30 32C38.8 32 46 36.5 46 42Z" fill="white" fillOpacity="0.9" />
                      <defs>
                        <linearGradient id="paint0_linear" x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4F46E5" />
                          <stop offset="1" stopColor="#7C3AED" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h2 className="fw-bold mb-1">Create Account</h2>
                  <p className="text-muted mb-0">Join our community today</p>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <SecureBadge type="login" />
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="login-form">
                  <Form.Group className="mb-3 form-floating">
                    <Form.Control 
                      id="nameInput"
                      type="text" 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Form.Label htmlFor="nameInput">Full Name</Form.Label>
                  </Form.Group>
                  
                  <Form.Group className="mb-3 form-floating">
                    <Form.Control 
                      id="emailInput"
                      type="email" 
                      placeholder="Enter email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Label htmlFor="emailInput">Email address</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-3 form-floating">
                    <Form.Control 
                      id="passwordInput"
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Form.Label htmlFor="passwordInput">Password</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-3 form-floating">
                    <Form.Control 
                      id="confirmPasswordInput"
                      type="password" 
                      placeholder="Confirm Password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Form.Label htmlFor="confirmPasswordInput">Confirm Password</Form.Label>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg" 
                      className="login-btn mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <i className="bi bi-arrow-right ms-2"></i>
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center my-3 position-relative">
                      <hr />
                      <span className="bg-white px-3 position-absolute" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>or</span>
                    </div>
                    
                    <Button 
                      variant="outline-dark" 
                      onClick={handleGoogleAuth}
                      className="social-btn d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                  
                  <p className="text-center mt-4 mb-0">
                    Already have an account? <Button variant="link" className="p-0 text-decoration-none" onClick={navigateToLogin}>Login</Button>
                  </p>
                </Form>
              </Card.Body>
            </Card>

            <VerificationBadge />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register; 