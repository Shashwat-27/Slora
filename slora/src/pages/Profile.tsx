import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge, Tab, Nav } from 'react-bootstrap';

// Mock user data
const mockUserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  bio: 'Full-stack developer passionate about web technologies and collaborative learning. I enjoy participating in coding sessions and helping others.',
  avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  joinDate: 'January 2023'
};

// Mock room history
const mockRoomHistory = [
  {
    id: 1,
    name: 'Code with Me',
    date: '2023-03-24',
    duration: '1h 30m',
    category: 'Technology'
  },
  {
    id: 2,
    name: 'JavaScript Study Group',
    date: '2023-03-20',
    duration: '2h 15m',
    category: 'Education'
  },
  {
    id: 3,
    name: 'Web Design Workshop',
    date: '2023-03-15',
    duration: '1h 45m',
    category: 'Technology'
  },
  {
    id: 4,
    name: 'Freelance with Me',
    date: '2023-03-10',
    duration: '1h',
    category: 'Career'
  },
  {
    id: 5,
    name: 'React Beginners',
    date: '2023-03-05',
    duration: '2h',
    category: 'Education'
  }
];

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [bio, setBio] = useState(mockUserData.bio);
  const [name, setName] = useState(mockUserData.name);
  
  const handleSaveProfile = () => {
    setUserData({
      ...userData,
      name: name,
      bio: bio
    });
    setIsEditing(false);
  };
  
  return (
    <Container className="py-4">
      <h1 className="page-header mb-4">My Profile</h1>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="position-relative d-inline-block mb-3">
                <img 
                  src={userData.avatar} 
                  alt={userData.name} 
                  className="rounded-circle img-thumbnail" 
                  style={{ width: '150px', height: '150px' }}
                />
                {!isEditing && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="position-absolute bottom-0 end-0 rounded-circle"
                    disabled
                  >
                    <i className="bi bi-camera"></i>
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-center fs-4 fw-bold"
                  />
                </Form.Group>
              ) : (
                <h4 className="mb-1">{userData.name}</h4>
              )}
              
              <p className="text-muted">Member since {userData.joinDate}</p>
              
              {isEditing ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button variant="primary" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Card.Text className="mb-3">
                    {userData.bio}
                  </Card.Text>
                  <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm mt-4">
            <Card.Body>
              <h5 className="mb-3">Contact Information</h5>
              <p className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                {userData.email}
              </p>
              <hr />
              <h5 className="mb-3">Account Settings</h5>
              <ListGroup variant="flush">
                <ListGroup.Item action className="border-0 px-0">
                  <i className="bi bi-lock me-2"></i>
                  Change Password
                </ListGroup.Item>
                <ListGroup.Item action className="border-0 px-0">
                  <i className="bi bi-bell me-2"></i>
                  Notification Settings
                </ListGroup.Item>
                <ListGroup.Item action className="border-0 px-0">
                  <i className="bi bi-gear me-2"></i>
                  Account Preferences
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <Nav variant="tabs" defaultActiveKey="activity" className="card-header-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="activity">Activity History</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="achievements">Achievements</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="activity" active>
                  <h5 className="mb-3">Recent Room Activity</h5>
                  <ListGroup>
                    {mockRoomHistory.map(room => (
                      <ListGroup.Item key={room.id} className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1">{room.name}</h6>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              {room.date}
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {room.duration}
                            </small>
                          </div>
                        </div>
                        <div>
                          <Badge bg="light" text="dark">
                            {room.category}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="achievements">
                  <div className="text-center py-4">
                    <h5 className="mb-3">Achievements Coming Soon!</h5>
                    <p className="text-muted">
                      We're working on a new achievement system to recognize your contributions
                      and participation in the Slora community.
                    </p>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 