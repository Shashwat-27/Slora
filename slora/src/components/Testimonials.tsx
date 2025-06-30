import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Testimonial data with properly escaped apostrophes
const testimonials = [
  {
    id: 1,
    name: 'Michael Roberts',
    role: 'Product Manager',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    content: "The rooms on Slora have revolutionized how our remote team collaborates. It's like we're all in the same office.",
    rating: 5
  },
  {
    id: 2,
    name: 'Alex Johnson',
    role: 'Graduate Student',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: "As a PhD student, I find the focused study rooms incredibly helpful. It's like having a virtual library with built-in accountability.",
    rating: 5
  },
  {
    id: 3,
    name: 'Aisha Johnson',
    role: 'Freelance Designer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: "Connecting with other designers in Slora rooms has helped me grow my network and improve my skills. The community is fantastic!",
    rating: 4
  },
  {
    id: 4,
    name: 'Emma Davis',
    role: 'Marketing Director',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    content: "Our virtual marketing workshops on Slora have better engagement than our previous platform. The interface is intuitive and feature-rich.",
    rating: 5
  }
];

const ReviewsSection: React.FC = () => {
  return (
    <div className="reviews-section py-5" id="reviews">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">What Our Community Says</h2>
          <p className="lead text-muted">Join thousands of satisfied users already collaborating on our platform</p>
        </div>
        
        <Row className="g-4">
          {testimonials.map(testimonial => (
            <Col md={6} key={testimonial.id}>
              <Card className="h-100 border-0 shadow-sm testimonial-card">
                <Card.Body className="p-4">
                  <div className="d-flex mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="rounded-circle me-3"
                      width="60"
                      height="60"
                    />
                    <div>
                      <h5 className="mb-1">{testimonial.name}</h5>
                      <p className="text-muted mb-0">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mb-3">{testimonial.content}</p>
                  <div className="text-primary">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi bi-star-fill me-1 ${i < testimonial.rating ? 'text-warning' : 'text-muted'}`}
                      ></i>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-5">
          <img 
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Team collaboration" 
            className="img-fluid rounded-4 shadow"
            style={{ maxWidth: '800px' }}
          />
        </div>
      </Container>
    </div>
  );
};

export default ReviewsSection; 