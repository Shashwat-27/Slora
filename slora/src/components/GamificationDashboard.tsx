import React from 'react';
import { Card, Row, Col, ProgressBar, Badge, ListGroup, Button } from 'react-bootstrap';

// Types for our gamification data
interface UserBadge {
  id: number;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
}

interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  completed: boolean;
}

interface GamificationDashboardProps {
  currentXP: number;
  level: number;
  xpForNextLevel: number;
  badges: UserBadge[];
  leaderboard: LeaderboardUser[];
  dailyChallenges: DailyChallenge[];
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  currentXP,
  level,
  xpForNextLevel,
  badges,
  leaderboard,
  dailyChallenges
}) => {
  // Calculate XP progress percentage
  const xpProgressPercentage = Math.min(Math.round((currentXP / xpForNextLevel) * 100), 100);
  
  // Filter earned badges
  const earnedBadges = badges.filter(badge => badge.earned);
  
  return (
    <div className="gamification-dashboard">
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="mb-0">Level {level}</h3>
                  <p className="text-muted mb-0">Keep collaborating to level up!</p>
                </div>
                <div className="text-end">
                  <h4 className="text-primary mb-0">{currentXP} / {xpForNextLevel} XP</h4>
                  <small className="text-muted">{xpForNextLevel - currentXP} XP to next level</small>
                </div>
              </div>
              <ProgressBar 
                now={xpProgressPercentage} 
                variant="primary" 
                style={{ height: "10px" }}
                className="mb-0"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <h4 className="mb-0">Your Badges</h4>
              <p className="text-muted">Achievements you've unlocked</p>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {earnedBadges.length > 0 ? (
                  earnedBadges.map(badge => (
                    <Col key={badge.id} xs={6} md={4} lg={3}>
                      <div className="badge-item text-center">
                        <div className="badge-icon mb-2 mx-auto d-flex align-items-center justify-content-center">
                          <i className={`bi ${badge.icon} fs-2`}></i>
                        </div>
                        <h6 className="badge-name mb-1">{badge.name}</h6>
                        <small className="text-muted d-block">{badge.description}</small>
                        <small className="text-primary d-block mt-1">
                          Earned {badge.earnedDate}
                        </small>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col className="text-center py-4">
                    <i className="bi bi-award text-muted fs-1"></i>
                    <p className="mt-3 mb-0">Complete challenges to earn badges!</p>
                  </Col>
                )}
              </Row>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 text-end">
              <Button variant="outline-primary" size="sm">View All Badges</Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <h4 className="mb-0">Leaderboard</h4>
              <p className="text-muted">Top collaborators this week</p>
            </Card.Header>
            <Card.Body className="pb-0">
              <ListGroup variant="flush">
                {leaderboard.map(user => (
                  <ListGroup.Item key={user.id} className="px-0 py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="leaderboard-rank me-3">
                        <span className={`rank-badge rank-${user.rank <= 3 ? user.rank : 'other'}`}>
                          {user.rank}
                        </span>
                      </div>
                      <div className="leaderboard-avatar me-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </div>
                      <div className="leaderboard-info flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{user.name}</h6>
                          <Badge bg="light" text="dark" pill>
                            Lvl {user.level}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">XP earned</small>
                          <span className="text-primary fw-bold">{user.xp}</span>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            <Card.Footer className="bg-white text-center">
              <Button variant="link" className="text-decoration-none p-0">
                View Full Leaderboard
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">Daily Challenges</h4>
                  <p className="text-muted">Complete these to earn XP and badges</p>
                </div>
                <Badge bg="warning" text="dark" pill>Refreshes in 10:45:30</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {dailyChallenges.map(challenge => (
                  <Col key={challenge.id} md={6} lg={4}>
                    <Card className={`challenge-card h-100 ${challenge.completed ? 'border-success' : 'border-light'}`}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className={challenge.completed ? 'text-success' : ''}>{challenge.title}</h5>
                          <Badge bg={challenge.completed ? 'success' : 'primary'} pill>
                            +{challenge.xpReward} XP
                          </Badge>
                        </div>
                        <p className="text-muted mb-3">{challenge.description}</p>
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small>Progress</small>
                            <small className="text-primary">{challenge.progress}/{challenge.total}</small>
                          </div>
                          <ProgressBar 
                            now={(challenge.progress / challenge.total) * 100} 
                            variant={challenge.completed ? "success" : "primary"} 
                            style={{ height: "6px" }}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GamificationDashboard; 