import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import SecureBadge from './SecureBadge';

const PricingSection: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  
  return (
    <div id="pricing" className="pricing-section py-4">
      <Container>
        <div className="text-center mb-3">
          <h2 className="display-5 fw-bold mb-2">Simple, Transparent Pricing</h2>
          <p className="lead text-muted">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
          
          <div className="d-flex justify-content-center mt-3 mb-3">
            <div className="form-check form-switch form-check-inline">
              <label className="form-check-label me-3">
                Monthly
              </label>
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={annualBilling}
                onChange={() => setAnnualBilling(!annualBilling)}
                style={{ width: '3rem', height: '1.5rem' }}
                aria-label="Toggle between monthly and annual billing"
                title="Toggle between monthly and annual billing"
              />
              <label className="form-check-label ms-3 d-flex align-items-center">
                Annual
                <Badge bg="danger" className="ms-2 rounded-pill">Save 20%</Badge>
              </label>
            </div>
          </div>
        </div>
        
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 pricing-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h5 className="fw-normal text-muted">Basic</h5>
                  <h2 className="display-5 fw-bold">
                    ${annualBilling ? '4.99' : '5.99'}
                    <span className="fs-6 text-muted fw-light"> / month</span>
                  </h2>
                  {annualBilling && <small className="text-success">Billed annually (${4.99 * 12})</small>}
                </div>
                
                <hr />
                
                <ul className="list-unstyled mb-4">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Join up to 3 rooms simultaneously
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    1 hour of video calls per day
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Basic profile customization
                  </li>
                  <li className="mb-3 text-muted">
                    <i className="bi bi-x-circle me-2"></i>
                    Priority room access
                  </li>
                  <li className="mb-3 text-muted">
                    <i className="bi bi-x-circle me-2"></i>
                    Create private rooms
                  </li>
                </ul>
                
                <div className="d-grid">
                  <Button variant="outline-primary" size="lg">
                    Start Free Trial
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 shadow border-primary pricing-card-popular">
              <div className="bg-primary text-white py-2 text-center">
                <small className="fw-bold">MOST POPULAR</small>
              </div>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h5 className="fw-normal text-muted">Pro</h5>
                  <h2 className="display-5 fw-bold">
                    ${annualBilling ? '9.99' : '12.99'}
                    <span className="fs-6 text-muted fw-light"> / month</span>
                  </h2>
                  {annualBilling && <small className="text-success">Billed annually (${9.99 * 12})</small>}
                </div>
                
                <hr />
                
                <ul className="list-unstyled mb-4">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Join unlimited rooms
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    5 hours of video calls per day
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Advanced profile customization
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Priority room access
                  </li>
                  <li className="mb-3 text-muted">
                    <i className="bi bi-x-circle me-2"></i>
                    Create private rooms
                  </li>
                </ul>
                
                <div className="d-grid">
                  <Button variant="primary" size="lg">
                    Start Free Trial
                  </Button>
                  <div className="text-center mt-3">
                    <SecureBadge type="payment" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 pricing-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h5 className="fw-normal text-muted">Premium</h5>
                  <h2 className="display-5 fw-bold">
                    ${annualBilling ? '19.99' : '24.99'}
                    <span className="fs-6 text-muted fw-light"> / month</span>
                  </h2>
                  {annualBilling && <small className="text-success">Billed annually (${19.99 * 12})</small>}
                </div>
                
                <hr />
                
                <ul className="list-unstyled mb-4">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Join unlimited rooms
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Unlimited video calls
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Premium profile customization
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Priority room access
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Create private rooms
                  </li>
                </ul>
                
                <div className="d-grid">
                  <Button variant="outline-primary" size="lg">
                    Start Free Trial
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div className="text-center mt-4">
          <p className="text-muted mb-3">
            <i className="bi bi-shield-check me-2"></i>
            All plans include enterprise-grade security and data protection.
          </p>
          
          <div className="row justify-content-center mt-5">
            <div className="col-md-8">
              <div className="d-flex flex-wrap justify-content-center gap-4">
                <div className="feature-badge d-flex align-items-center px-3 py-2 bg-light rounded-pill shadow-sm">
                  <i className="bi bi-lightning-charge text-warning me-2"></i>
                  <span>Fast Setup</span>
                </div>
                <div className="feature-badge d-flex align-items-center px-3 py-2 bg-light rounded-pill shadow-sm">
                  <i className="bi bi-shield-lock text-success me-2"></i>
                  <span>Secure Rooms</span>
                </div>
                <div className="feature-badge d-flex align-items-center px-3 py-2 bg-light rounded-pill shadow-sm">
                  <i className="bi bi-credit-card text-primary me-2"></i>
                  <span>Easy Billing</span>
                </div>
                <div className="feature-badge d-flex align-items-center px-3 py-2 bg-light rounded-pill shadow-sm">
                  <i className="bi bi-headset text-danger me-2"></i>
                  <span>24/7 Support</span>
                </div>
                <div className="feature-badge d-flex align-items-center px-3 py-2 bg-light rounded-pill shadow-sm">
                  <i className="bi bi-arrow-counterclockwise text-info me-2"></i>
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PricingSection; 