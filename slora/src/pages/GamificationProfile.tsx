import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav, ProgressBar, Badge, Button } from 'react-bootstrap';
import { userGamificationData } from '../components/GamificationData';
import GamificationDashboard from '../components/GamificationDashboard';
import '../styles/Gamification.css';

const GamificationProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const userData = userGamificationData;

  return (
    <>
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-2">Your Slora Profile</h1>
            <p className="text-muted">Track your progress and achievements</p>
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <div className="level-badge">
              <i className="bi bi-star-fill me-2"></i>
              Level {userData.level}
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={2} className="text-center mb-3 mb-md-0">
                    <div className="position-relative">
                      <img 
                        src="https://randomuser.me/api/portraits/men/41.jpg" 
                        alt="Profile" 
                        className="rounded-circle img-thumbnail" 
                        width="100"
                        height="100"
                      />
                      <Badge 
                        bg="primary" 
                        pill 
                        className="position-absolute" 
                        style={{ bottom: '0', right: '30%', border: '2px solid white' }}
                      >
                        {userData.level}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3 mb-md-0">
                    <h3 className="mb-1">Michael Roberts</h3>
                    <p className="text-muted mb-2">
                      <i className="bi bi-geo-alt me-1"></i> New York, USA
                      <span className="mx-2">•</span>
                      <i className="bi bi-calendar3 me-1"></i> Joined {userData.joinDate}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <Badge bg="light" text="dark" className="py-2 px-3">
                        <i className="bi bi-lightning-charge me-1 text-warning"></i>
                        {userData.streakDays} Day Streak
                      </Badge>
                      <Badge bg="light" text="dark" className="py-2 px-3">
                        <i className="bi bi-calendar-check me-1 text-success"></i>
                        {userData.daysActive} Days Active
                      </Badge>
                      <Badge bg="light" text="dark" className="py-2 px-3">
                        <i className="bi bi-trophy me-1 text-primary"></i>
                        {userData.badges.filter(b => b.earned).length} Badges
                      </Badge>
                    </div>
                  </Col>
                  <Col md={4} className="text-md-end">
                    <div className="mb-2">
                      <span className="text-muted fs-6">Total XP Earned</span>
                      <h3 className="mb-0 text-primary">{userData.totalXPEarned} XP</h3>
                    </div>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <i className="bi bi-pencil me-1"></i> Edit Profile
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-share me-1"></i> Share
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Tab.Container id="profile-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')}>
          <Row className="mb-4">
            <Col>
              <Nav variant="pills" className="profile-nav">
                <Nav.Item>
                  <Nav.Link eventKey="dashboard" className="d-flex align-items-center">
                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="badges" className="d-flex align-items-center">
                    <i className="bi bi-award me-2"></i> Badges & Achievements
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="stats" className="d-flex align-items-center">
                    <i className="bi bi-bar-chart me-2"></i> Activity Stats
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings" className="d-flex align-items-center">
                    <i className="bi bi-gear me-2"></i> Settings
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Tab.Content>
            <Tab.Pane eventKey="dashboard">
              <GamificationDashboard 
                currentXP={userData.currentXP} 
                level={userData.level} 
                xpForNextLevel={userData.xpForNextLevel} 
                badges={userData.badges} 
                leaderboard={userData.leaderboard} 
                dailyChallenges={userData.dailyChallenges} 
              />
            </Tab.Pane>
            
            <Tab.Pane eventKey="badges">
              <Row>
                <Col>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white pt-4 pb-3">
                      <h4 className="mb-0">Your Badges</h4>
                      <p className="text-muted mb-0">
                        You've earned {userData.badges.filter(b => b.earned).length} out of {userData.badges.length} badges
                      </p>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-4">
                        {userData.badges.map(badge => (
                          <Col key={badge.id} lg={3} md={4} sm={6}>
                            <Card className={`h-100 ${badge.earned ? 'border-primary' : 'border-light opacity-75'}`}>
                              <Card.Body className="text-center">
                                <div 
                                  className={`badge-icon mx-auto mb-3 d-flex align-items-center justify-content-center ${!badge.earned && 'opacity-50'}`}
                                  style={{ width: '80px', height: '80px' }}
                                >
                                  <i className={`bi ${badge.icon} fs-1`}></i>
                                </div>
                                <h5 className="badge-name">{badge.name}</h5>
                                <p className="text-muted small mb-3">{badge.description}</p>
                                {badge.earned ? (
                                  <Badge bg="success" pill className="px-3 py-2">
                                    <i className="bi bi-check-circle me-1"></i> Earned
                                  </Badge>
                                ) : (
                                  <Badge bg="light" text="muted" pill className="px-3 py-2">
                                    <i className="bi bi-lock me-1"></i> Locked
                                  </Badge>
                                )}
                                {badge.earned && (
                                  <div className="mt-2 text-primary small">
                                    {badge.earnedDate}
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white pt-4 pb-3">
                      <h4 className="mb-0">Upcoming Achievements</h4>
                      <p className="text-muted mb-0">
                        Complete these activities to earn more badges
                      </p>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-4">
                        <Col lg={4}>
                          <Card className="border-light h-100">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="badge-icon d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                  <i className="bi bi-diagram-3 fs-2"></i>
                                </div>
                                <Badge bg="warning" text="dark" pill>In Progress</Badge>
                              </div>
                              <h5>Networker</h5>
                              <p className="text-muted small">Connect with 20 other users</p>
                              <div className="mt-4">
                                <div className="d-flex justify-content-between mb-1">
                                  <small>Progress</small>
                                  <small className="text-primary">12/20</small>
                                </div>
                                <ProgressBar now={60} style={{ height: "6px" }} />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col lg={4}>
                          <Card className="border-light h-100">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="badge-icon d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                  <i className="bi bi-lightning-charge fs-2"></i>
                                </div>
                                <Badge bg="warning" text="dark" pill>In Progress</Badge>
                              </div>
                              <h5>Power User</h5>
                              <p className="text-muted small">Use the platform for 30 days straight</p>
                              <div className="mt-4">
                                <div className="d-flex justify-content-between mb-1">
                                  <small>Progress</small>
                                  <small className="text-primary">12/30</small>
                                </div>
                                <ProgressBar now={40} style={{ height: "6px" }} />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col lg={4}>
                          <Card className="border-light h-100">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="badge-icon d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                  <i className="bi bi-mortarboard fs-2"></i>
                                </div>
                                <Badge bg="warning" text="dark" pill>In Progress</Badge>
                              </div>
                              <h5>Mentor</h5>
                              <p className="text-muted small">Help 10 users with their questions</p>
                              <div className="mt-4">
                                <div className="d-flex justify-content-between mb-1">
                                  <small>Progress</small>
                                  <small className="text-primary">4/10</small>
                                </div>
                                <ProgressBar now={40} style={{ height: "6px" }} />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="stats">
              <p className="text-center text-muted py-5">
                Activity stats section will be implemented in the next update.
              </p>
            </Tab.Pane>

            <Tab.Pane eventKey="settings">
              <p className="text-center text-muted py-5">
                Gamification settings will be implemented in the next update.
              </p>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
};

export default GamificationProfile; 