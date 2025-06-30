import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import all the sections
import LandingNavbar from '../components/LandingNavbar';
import HeroSection from '../components/HeroSection';
import WhyJoinSection from '../components/WhyJoinSection';
import HowItWorksSection from '../components/HowItWorksSection';
import PricingSection from '../components/PricingSection';
import ReviewsSection from '../components/ReviewsSection';
import AboutSection from '../components/AboutSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

import '../styles/Landing.css';

export default function Landing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="landing-page">
      <LandingNavbar />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="why-join">
        <WhyJoinSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="reviews">
        <ReviewsSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="blog">
        <BlogSection />
      </div>
      <section id="cta" className="py-5 bg-primary bg-gradient text-white">
        <Container className="text-center">
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-4">Ready to Transform Your Collaboration Experience?</h2>
              <p className="lead mb-4 mx-auto">
                Join thousands of individuals and teams who are already experiencing the benefits of Slora's virtual rooms.
              </p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <Button 
                  variant="light"
                  size="lg" 
                  className="px-4 py-2"
                  onClick={handleGetStarted}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  {currentUser ? 'Go to Dashboard' : 'Join Slora Free'}
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  className="px-4 py-2"
                  onClick={() => navigate('/demo')}
                >
                  <i className="bi bi-cursor me-2"></i>
                  Schedule a Demo
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </div>
  );
} 