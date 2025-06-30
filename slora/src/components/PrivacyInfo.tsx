import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const PrivacyInfo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const handleClose = () => setShowModal(false);
  const handleShow = (policy: string) => {
    setActivePolicy(policy);
    setShowModal(true);
  };

  const renderPolicyContent = () => {
    switch (activePolicy) {
      case 'privacy':
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Privacy Policy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Your Privacy Matters</h5>
              <p>At Slora, we take your privacy seriously. This Privacy Policy outlines the types of personal information we collect, how we use it, and the steps we take to protect it.</p>
              
              <h6 className="mt-4">Information We Collect</h6>
              <ul>
                <li>Account information (name, email, profile picture)</li>
                <li>Usage data (rooms joined, messages sent, time spent)</li>
                <li>Device information (browser type, IP address)</li>
              </ul>
              
              <h6 className="mt-4">How We Use Your Information</h6>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To improve user experience</li>
                <li>To communicate with you</li>
                <li>To ensure the security of our platform</li>
              </ul>
              
              <h6 className="mt-4">Data Protection</h6>
              <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
            </Modal.Body>
          </>
        );
      case 'terms':
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Terms of Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Terms and Conditions</h5>
              <p>By using Slora, you agree to these Terms of Service. Please read them carefully.</p>
              
              <h6 className="mt-4">User Accounts</h6>
              <p>You are responsible for safeguarding your account and for all activities that occur under your account.</p>
              
              <h6 className="mt-4">Acceptable Use</h6>
              <p>You agree not to:</p>
              <ul>
                <li>Post content that violates laws or rights of others</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Use the service for unauthorized commercial purposes</li>
                <li>Attempt to interfere with or compromise the system integrity or security</li>
              </ul>
              
              <h6 className="mt-4">Termination</h6>
              <p>We reserve the right to suspend or terminate your account if you violate these terms or for any other reason at our sole discretion.</p>
            </Modal.Body>
          </>
        );
      case 'cookies':
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Cookie Policy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>How We Use Cookies</h5>
              <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience.</p>
              
              <h6 className="mt-4">Types of Cookies We Use</h6>
              <ul>
                <li><strong>Essential cookies:</strong> Required for basic functionality</li>
                <li><strong>Functional cookies:</strong> Remember your preferences</li>
                <li><strong>Analytics cookies:</strong> Help us understand how you use our platform</li>
                <li><strong>Marketing cookies:</strong> Used to deliver relevant content</li>
              </ul>
              
              <h6 className="mt-4">Managing Cookies</h6>
              <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
            </Modal.Body>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="privacy-links d-flex justify-content-center gap-3 mb-3">
        <Button variant="link" className="text-muted small p-0" onClick={() => handleShow('privacy')}>
          Privacy Policy
        </Button>
        <span className="text-muted">|</span>
        <Button variant="link" className="text-muted small p-0" onClick={() => handleShow('terms')}>
          Terms of Service
        </Button>
        <span className="text-muted">|</span>
        <Button variant="link" className="text-muted small p-0" onClick={() => handleShow('cookies')}>
          Cookie Policy
        </Button>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg">
        {renderPolicyContent()}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PrivacyInfo; 