import React from 'react';
import { Card, Table, Image, ProgressBar, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../styles/Leaderboard.css';

// Mock leaderboard data
const mockLeaderboardData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    points: 1250,
    isYou: false,
    badge: 'Platinum',
    badgeColor: 'primary'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    points: 980,
    isYou: false,
    badge: 'Gold',
    badgeColor: 'warning'
  },
  {
    id: 3,
    name: 'Alex Morgan',
    avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
    points: 870,
    isYou: false,
    badge: 'Gold',
    badgeColor: 'warning'
  },
  {
    id: 4,
    name: 'James Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    points: 760,
    isYou: false,
    badge: 'Silver',
    badgeColor: 'secondary'
  },
  {
    id: 5,
    name: 'Ella Davis',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    points: 650,
    isYou: false,
    badge: 'Silver',
    badgeColor: 'secondary'
  }
];

const Leaderboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Prepare leaderboard data with current user
  const getLeaderboardData = () => {
    const updatedData = [...mockLeaderboardData];
    
    // Get user's name for the leaderboard
    let userName = 'You';
    if (currentUser) {
      if (currentUser.displayName) {
        userName = currentUser.displayName;
      } else if (currentUser.email) {
        const emailName = currentUser.email.split('@')[0];
        // Capitalize first letter
        userName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }
    }
    
    // Find if user is already in the list and mark as "You"
    const userIndex = updatedData.findIndex(user => 
      (currentUser?.displayName && user.name === currentUser.displayName) ||
      (currentUser?.email && user.name.toLowerCase() === userName.toLowerCase())
    );
    
    if (userIndex >= 0) {
      updatedData[userIndex].isYou = true;
      return updatedData;
    }
    
    // Add user if not in list
    const userEntry = {
      id: 999,
      name: userName,
      avatar: currentUser?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
      points: 580,
      isYou: true,
      badge: 'Bronze',
      badgeColor: 'bronze'
    };
    
    updatedData.push(userEntry);
    return updatedData.sort((a, b) => b.points - a.points);
  };
  
  const leaderboardData = getLeaderboardData();
  
  return (
    <Card className="leaderboard-card">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Community Leaderboard</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Table hover responsive className="mb-0">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '40%' }}>Member</th>
              <th style={{ width: '35%' }}>Points</th>
              <th style={{ width: '20%' }}>Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr key={user.id} className={user.isYou ? 'table-primary' : ''}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Image 
                      src={user.avatar} 
                      alt={user.name}
                      roundedCircle
                      width={32}
                      height={32}
                      className="me-2 border"
                    />
                    <span className={user.isYou ? 'fw-bold' : ''}>
                      {user.name} {user.isYou && <span className="text-muted">(You)</span>}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <small>{user.points} pts</small>
                      <small>
                        {index === 0 ? '1000+' : (index < 3 ? '750+' : '500+')}
                      </small>
                    </div>
                    <ProgressBar 
                      now={user.points > 1000 ? 100 : (user.points / 10)} 
                      variant={index < 2 ? 'primary' : (index < 4 ? 'success' : 'info')}
                      style={{ height: '6px' }}
                    />
                  </div>
                </td>
                <td>
                  <Badge 
                    bg={user.badgeColor === 'bronze' ? 'warning' : user.badgeColor} 
                    className={`badge-${user.badgeColor}`}
                  >
                    {user.badge}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default Leaderboard; 