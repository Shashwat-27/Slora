import React, { useState } from 'react';
import { Card, ListGroup, Button, Modal } from 'react-bootstrap';

const DataSecurity: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-shield-lock text-primary me-2"></i>
              Data Security
            </h5>
            <Button variant="outline-primary" size="sm" onClick={handleShow}>
              Learn More
            </Button>
          </div>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="px-4 py-3">
            <div className="d-flex">
              <i className="bi bi-lock-fill text-success me-3 fs-5"></i>
              <div>
                <h6 className="mb-1">End-to-End Encryption</h6>
                <p className="small text-muted mb-0">All messages and calls are encrypted</p>
              </div>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3">
            <div className="d-flex">
              <i className="bi bi-fingerprint text-success me-3 fs-5"></i>
              <div>
                <h6 className="mb-1">Identity Verification</h6>
                <p className="small text-muted mb-0">All users are verified before joining rooms</p>
              </div>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3">
            <div className="d-flex">
              <i className="bi bi-eye-slash text-success me-3 fs-5"></i>
              <div>
                <h6 className="mb-1">Privacy Controls</h6>
                <p className="small text-muted mb-0">You control what information is shared</p>
              </div>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>How We Protect Your Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>State-of-the-Art Security</h5>
          <p>
            At Slora, the security and privacy of your data is our top priority. We implement multiple layers of protection to ensure your information remains safe.
          </p>
          
          <h6 className="mt-4">End-to-End Encryption (E2EE)</h6>
          <p>
            All messages, file transfers, and video calls are protected with end-to-end encryption, which means that only you and the people you're communicating with can read them. 
            Not even Slora can access your encrypted conversations.
          </p>
          
          <h6 className="mt-4">Secure Data Storage</h6>
          <p>
            All personal data is encrypted at rest using AES-256, one of the strongest encryption algorithms available. Our databases are protected by multiple security layers and regularly audited for vulnerabilities.
          </p>
          
          <h6 className="mt-4">Identity Verification</h6>
          <p>
            We use multi-factor authentication and advanced identity verification techniques to ensure that only authorized users can access their accounts and join rooms.
          </p>
          
          <h6 className="mt-4">Regular Security Audits</h6>
          <p>
            Our systems undergo regular security audits and penetration testing by independent third-party security firms to identify and address potential vulnerabilities.
          </p>
          
          <h6 className="mt-4">Compliance</h6>
          <p>
            Slora is compliant with major data protection regulations including GDPR, CCPA, and industry standards like SOC 2 and ISO 27001.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DataSecurity; 