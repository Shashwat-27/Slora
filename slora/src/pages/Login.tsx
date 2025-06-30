import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Nav, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import SecureBadge from '../components/SecureBadge';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { signUp, logIn, signInWithGoogle, error: authError, clearError, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path if coming from a protected route
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Check if user is already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
  
  // Check if we're in signup mode from URL state
  useEffect(() => {
    if (location.state && 'signup' in location.state && location.state.signup) {
      setIsSignUp(true);
    }
  }, [location.state]);
  
  // Clear any auth errors when toggling between login/signup
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [isSignUp, clearError, authError]);
  
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setFormErrors({});
  };
  
  const validateForm = () => {
    setError('');
    
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (isSignUp && !name) {
      setError('Name is required');
      return false;
    }
    
    if (isSignUp && !agreeTerms) {
      setError('You must agree to the terms');
      return false;
    }
    
    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    setFormErrors({});
    return true;
  };
  
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
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await logIn(email, password, rememberMe);
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Extract error code from Firebase error
      const errorCode = error.code || '';
      setError(getErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in the auth context
      console.error('Google authentication error:', err);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="dotted-pattern"></div>
      </div>
      
      <Container className="py-5 position-relative">
        <Row className="justify-content-center">
          <Col md={8} lg={10} xl={11}>
            <Row className="bg-white shadow-lg rounded-5 overflow-hidden">
              {/* Left side - Illustration and benefits */}
              <Col lg={6} className="d-none d-lg-block p-0">
                <div className="login-image-side h-100 d-flex flex-column justify-content-between p-5 text-white">
                  <div>
                    <h2 className="fw-bold mb-4">Join Slora Today!</h2>
                    <p className="fs-5 mb-4">Connect with like-minded individuals in a secure virtual space.</p>
                  </div>
                  
                  <div className="benefits-section">
                    <div className="benefit-item d-flex align-items-center mb-4">
                      <div className="benefit-icon">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1">Secure Environment</h6>
                        <p className="mb-0 small">End-to-end encryption for all conversations</p>
                      </div>
                    </div>
                    
                    <div className="benefit-item d-flex align-items-center mb-4">
                      <div className="benefit-icon">
                        <i className="bi bi-trophy"></i>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1">Gamified Experience</h6>
                        <p className="mb-0 small">Earn XP and badges as you participate</p>
                      </div>
                    </div>
                    
                    <div className="benefit-item d-flex align-items-center">
                      <div className="benefit-icon">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1">Community Building</h6>
                        <p className="mb-0 small">Create and join communities of your interest</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="login-stats d-flex justify-content-between">
                    <div className="text-center">
                      <h3 className="mb-0">50k+</h3>
                      <small>Active Users</small>
                    </div>
                    <div className="text-center">
                      <h3 className="mb-0">1.2k+</h3>
                      <small>Virtual Rooms</small>
                    </div>
                    <div className="text-center">
                      <h3 className="mb-0">95%</h3>
                      <small>Satisfaction</small>
                    </div>
                  </div>
                </div>
              </Col>
              
              {/* Right side - Login form */}
              <Col lg={6}>
                <Card className="border-0 h-100">
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
                      <h2 className="fw-bold mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                      <p className="text-muted mb-0">{isSignUp ? 'Join our community today' : 'Sign in to continue to Slora'}</p>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <SecureBadge type="login" />
                      <Badge bg="light" text="dark" pill className="px-3 py-2 border">
                        <i className="bi bi-shield-lock-fill text-success me-1"></i> 
                        SSL Encrypted
                      </Badge>
                    </div>
                    
                    {error && (
                      <Alert variant="danger" dismissible onClose={clearError}>
                        {error}
                      </Alert>
                    )}
                    
                    <Alert variant="info" className="demo-credentials-alert">
                      <strong>Demo Credentials:</strong>
                      <div className="mt-1">Email: user@example.com</div>
                      <div>Password: password123</div>
                    </Alert>
                    
                    <Nav 
                      variant="pills" 
                      className="nav-justified mb-4 authentication-nav"
                      activeKey={isSignUp ? "signup" : "login"}
                    >
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="login" 
                          onClick={() => toggleMode()}
                          className="rounded-pill"
                        >
                          Login
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="signup" 
                          onClick={() => toggleMode()}
                          className="rounded-pill"
                        >
                          Sign Up
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    
                    <Form onSubmit={handleSubmit} className="login-form">
                      {isSignUp && (
                        <Form.Group className="mb-3 form-floating">
                          <Form.Control 
                            id="nameInput"
                            type="text" 
                            placeholder="Enter your name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isInvalid={!!formErrors.name}
                            required
                          />
                          <Form.Label htmlFor="nameInput">Full Name</Form.Label>
                          <Form.Control.Feedback type="invalid">
                            {formErrors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      )}
                      
                      <Form.Group className="mb-3 form-floating">
                        <Form.Control 
                          id="emailInput"
                          type="email" 
                          placeholder="Enter email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          isInvalid={!!formErrors.email}
                          required
                        />
                        <Form.Label htmlFor="emailInput">Email address</Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-4 form-floating">
                        <Form.Control 
                          id="passwordInput"
                          type="password" 
                          placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          isInvalid={!!formErrors.password}
                          required
                        />
                        <Form.Label htmlFor="passwordInput">Password</Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          {!isSignUp && "Password must be at least 6 characters"}
                        </Form.Text>
                      </Form.Group>

                      {isSignUp && (
                        <Form.Group className="mb-4">
                          <Form.Check 
                            type="checkbox" 
                            id="termsCheck"
                            label={
                              <span>I agree to the <a href="#terms" className="text-decoration-none">Terms of Service</a> and <a href="#privacy" className="text-decoration-none">Privacy Policy</a></span>
                            }
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            isInvalid={!!formErrors.terms}
                            feedback={formErrors.terms}
                            feedbackType="invalid"
                            required
                          />
                        </Form.Group>
                      )}

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
                              {isSignUp ? 'Creating Account...' : 'Logging In...'}
                            </>
                          ) : (
                            <>
                              {isSignUp ? 'Create Account' : 'Login'}
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
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <VerificationBadge />

            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                <i className="bi bi-lock-fill me-1"></i>
                Your information is securely encrypted with 256-bit SSL
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 