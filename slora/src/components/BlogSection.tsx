import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'How Virtual Communities Can Boost Your Productivity',
      excerpt: 'Discover how joining virtual co-working spaces can help you stay focused and accountable to your goals.',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      date: 'May 12, 2023',
      author: 'Sarah Johnson',
      authorImage: 'https://randomuser.me/api/portraits/women/23.jpg',
      category: 'Productivity'
    },
    {
      id: 2,
      title: '5 Ways to Make Meaningful Connections in Virtual Rooms',
      excerpt: 'Building relationships online can be challenging. Learn effective strategies for meaningful networking in virtual environments.',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      date: 'April 28, 2023',
      author: 'Michael Rodriguez',
      authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      category: 'Networking'
    },
    {
      id: 3,
      title: 'The Future of Remote Collaboration',
      excerpt: 'How technology is evolving to create more immersive and effective virtual collaboration experiences.',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      date: 'April 15, 2023',
      author: 'David Chen',
      authorImage: 'https://randomuser.me/api/portraits/men/54.jpg',
      category: 'Technology'
    }
  ];

  return (
    <div id="blog" className="blog-section py-4">
      <Container>
        <div className="text-center mb-3">
          <span className="text-primary fw-semibold mb-1 d-block">INSIGHTS</span>
          <h2 className="display-5 fw-bold mb-2">Latest from Our Blog</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Expert advice and insights to help you maximize your virtual community experience.
          </p>
        </div>
        
        <Row className="g-4">
          {blogPosts.map(post => (
            <Col key={post.id} lg={4} md={6}>
              <Card className="h-100 border-0 shadow-sm blog-card">
                <div className="position-relative">
                  <Card.Img variant="top" src={post.image} alt={post.title} />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-primary">{post.category}</span>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={post.authorImage} 
                      alt={post.author} 
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                    />
                    <small className="text-muted">{post.author}</small>
                    <span className="mx-2 text-muted">•</span>
                    <small className="text-muted">{post.date}</small>
                  </div>
                  <Card.Title className="h5 fw-bold mb-3">{post.title}</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    {post.excerpt}
                  </Card.Text>
                  <div className="text-end">
                    <Button variant="link" className="text-decoration-none p-0 fw-medium">
                      Read More <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-4">
          <Button variant="outline-primary" className="px-4 py-2">
            View All Articles
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default BlogSection; 