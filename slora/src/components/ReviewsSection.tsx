import React, { useState } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';

const ReviewsSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  const reviews = [
    {
      id: 1,
      name: 'Jessica Miller',
      role: 'Product Designer',
      company: 'DesignHub',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 5,
      text: "Slora has completely transformed how our remote team collaborates. The virtual rooms are intuitive and the tools provided make our creative sessions so much more productive. I can't imagine going back to our old workflow.",
      date: 'March 15, 2023'
    },
    {
      id: 2,
      name: 'Robert Chen',
      role: 'Frontend Developer',
      company: 'TechNova',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 5,
      text: "As a developer working with international teams, Slora has been a game-changer. The code collaboration features and ability to create persistent rooms for ongoing projects has improved our efficiency by at least 40%.",
      date: 'February 28, 2023'
    },
    {
      id: 3,
      name: 'Aisha Washington',
      role: 'Marketing Director',
      company: 'GrowthLab',
      image: 'https://randomuser.me/api/portraits/women/67.jpg',
      rating: 4,
      text: "Our marketing team relies on Slora daily for brainstorming sessions. The ability to save and reference past discussions has been invaluable for keeping our campaigns consistent and building on previous ideas.",
      date: 'April 10, 2023'
    },
    {
      id: 4,
      name: 'Carlos Mendez',
      role: 'Project Manager',
      company: 'BuildRight',
      image: 'https://randomuser.me/api/portraits/men/35.jpg',
      rating: 5,
      text: "Managing distributed teams became significantly easier with Slora. The structured virtual spaces help maintain focus, and the integration with our existing tools streamlined our entire workflow.",
      date: 'March 22, 2023'
    },
    {
      id: 5,
      name: 'Emma Thompson',
      role: 'Online Educator',
      company: 'LearnQuest',
      image: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 5,
      text: "Slora has revolutionized how I conduct my online classes. The engagement levels from my students have increased dramatically, and the collaborative features make learning much more interactive and enjoyable.",
      date: 'April 5, 2023'
    }
  ];

  // Group reviews into sets of 3 for the carousel
  const groupReviews = () => {
    const groups = [];
    for (let i = 0; i < reviews.length; i += 3) {
      groups.push(reviews.slice(i, i + 3));
    }
    return groups;
  };

  const reviewGroups = groupReviews();

  return (
    <div id="reviews" className="reviews-section py-4">
      <Container>
        <div className="text-center mb-3">
          <span className="text-primary fw-semibold mb-1 d-block">TESTIMONIALS</span>
          <h2 className="display-5 fw-bold mb-2">What Our Community Says</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Don't just take our word for it - hear from some of our satisfied users who have transformed their virtual collaboration experience with Slora.
          </p>
        </div>
        
        <Carousel 
          activeIndex={index} 
          onSelect={handleSelect}
          indicators={true}
          controls={true}
          interval={5000}
          className="review-carousel"
        >
          {reviewGroups.map((group, groupIndex) => (
            <Carousel.Item key={groupIndex}>
              <Row className="g-4">
                {group.map(review => (
                  <Col key={review.id} md={4}>
                    <Card className="h-100 border-0 shadow-sm p-4">
                      <div className="d-flex mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                        ))}
                      </div>
                      <Card.Body className="p-0">
                        <Card.Text className="mb-4 fst-italic">
                          "{review.text}"
                        </Card.Text>
                        <div className="d-flex align-items-center">
                          <img 
                            src={review.image} 
                            alt={review.name} 
                            className="rounded-circle me-3"
                            width="50"
                            height="50" 
                          />
                          <div>
                            <p className="fw-bold mb-0">{review.name}</p>
                            <p className="text-muted small mb-0">
                              {review.role} at {review.company}
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        
        <div className="text-center mt-4">
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex align-items-center me-4">
              <span className="display-6 fw-bold text-primary me-2">4.8</span>
              <div>
                <div className="d-flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning"></i>
                  ))}
                </div>
                <span className="text-muted small">Average Rating</span>
              </div>
            </div>
            <div className="vr mx-4" style={{ height: '50px' }}></div>
            <div className="text-center">
              <p className="display-6 fw-bold text-primary mb-0">10,000+</p>
              <span className="text-muted small">Happy Users</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ReviewsSection; 