import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Nav, Image, Dropdown, ProgressBar, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

// Types for room data
interface RoomData {
  id: number;
  name: string;
  image: string;
  category: string;
  participants: number;
  maxParticipants?: number;
  isLive: boolean;
  tags: string[];
  host: {
    name: string;
    level: number;
    avatar: string;
  };
  description?: string;
  createdAt?: string;
  isPublic?: boolean;
}

// Mock data for trending rooms
const trendingRooms = [
  {
    id: 1,
    name: "Advanced Data Structures Study Group",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Computer Science",
    participants: 24,
    isLive: true,
    tags: ["algorithms", "computer science", "interview prep"],
    host: {
      name: "Alex Chen",
      level: 8,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  },
  {
    id: 2,
    name: "MCAT Biology Preparation",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Medicine",
    participants: 18,
    isLive: true,
    tags: ["biology", "mcat", "pre-med"],
    host: {
      name: "Dr. Mia Johnson",
      level: 12,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  },
  {
    id: 3,
    name: "Python for Data Science",
    image: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
    participants: 32,
    isLive: false,
    tags: ["python", "data science", "machine learning"],
    host: {
      name: "Sophia Williams",
      level: 10,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  }
];

// Mock data for user stats
const userStats = {
  studyHours: 124,
  xp: 3850,
  xpToNextLevel: 4000,
  level: 7,
  rank: 342,
  totalBadges: 12,
  achievements: [
    {
      id: 1,
      name: "Consistency King",
      progress: 80,
      icon: "trophy",
      iconBg: "linear-gradient(45deg, #FFD700, #FFA500)",
      description: "Study for 30 days in a row"
    },
    {
      id: 2,
      name: "Knowledge Seeker",
      progress: 65,
      icon: "book",
      iconBg: "linear-gradient(45deg, #4F46E5, #7C3AED)",
      description: "Join 50 different study rooms"
    },
    {
      id: 3,
      name: "Helping Hand",
      progress: 35,
      icon: "hands-helping",
      iconBg: "linear-gradient(45deg, #10B981, #059669)",
      description: "Answer 100 questions in study rooms"
    }
  ]
};

// Mock data for recommended rooms
const recommendedRooms = [
  {
    id: 4,
    name: "JavaScript Frameworks Deep Dive",
    image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Web Development",
    participants: 15,
    isLive: false,
    tags: ["javascript", "react", "vue", "angular"],
    host: {
      name: "David Kim",
      level: 9,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  },
  {
    id: 5,
    name: "Organic Chemistry Study Session",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Chemistry",
    participants: 12,
    isLive: true,
    tags: ["organic chemistry", "molecules", "reactions"],
    host: {
      name: "Emily Zhao",
      level: 11,
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    }
  }
];

// Mock data for upcoming scheduled rooms
const upcomingRooms = [
  {
    id: 6,
    name: "Calculus II Problem Solving Session",
    time: "Today, 4:00 PM",
    category: "Mathematics",
    host: {
      name: "Prof. Robert Taylor",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    }
  },
  {
    id: 7,
    name: "Computer Architecture Study Group",
    time: "Tomorrow, 10:00 AM",
    category: "Computer Engineering",
    host: {
      name: "Ethan Brown",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg"
    }
  },
  {
    id: 8,
    name: "Financial Accounting Basics",
    time: "May 15, 2:30 PM",
    category: "Business",
    host: {
      name: "Olivia Martinez",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    }
  }
];

// Bookmarked rooms data
const bookmarkedRooms = [
  {
    id: 11,
    name: "UI/UX Design Principles",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Design",
    participants: 15,
    isLive: true,
    tags: ["ui", "ux", "design"],
    host: {
      name: "Lisa Wong",
      level: 18,
      avatar: "https://randomuser.me/api/portraits/women/89.jpg"
    }
  },
  {
    id: 12,
    name: "Digital Marketing Strategy",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Marketing",
    participants: 20,
    isLive: false,
    tags: ["marketing", "digital", "strategy"],
    host: {
      name: "Mike Johnson",
      level: 16,
      avatar: "https://randomuser.me/api/portraits/men/78.jpg"
    }
  }
];

const leaderboardData = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    level: 25,
    xp: 12500,
    streak: 30
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    level: 23,
    xp: 11500,
    streak: 28
  },
  {
    id: 3,
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    level: 22,
    xp: 11000,
    streak: 25
  }
];

const Dashboard: React.FC = () => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [joinMode, setJoinMode] = useState<"video" | "audio" | "watch">("video");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("trending");
  const [activeSection, setActiveSection] = useState('dashboard');
  const [filteredRooms, setFilteredRooms] = useState<RoomData[]>(trendingRooms);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    studyHours: 0,
    xp: 0,
    rank: 0,
    totalBadges: 0
  });
  const [joinSettings, setJoinSettings] = useState({
    videoEnabled: true,
    audioEnabled: true,
    chatEnabled: true,
    notificationsEnabled: true,
    recordingEnabled: false
  });
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false);
  const [myRooms, setMyRooms] = useState<RoomData[]>([]);
  
  // Load user's rooms from localStorage on component mount
  useEffect(() => {
    // Check for newly created rooms in localStorage
    const storedRooms = localStorage.getItem('myRooms');
    if (storedRooms) {
      const parsedRooms = JSON.parse(storedRooms);
      setMyRooms(parsedRooms);
    }
  }, []);

  // Handle any updates from room creation page
  useEffect(() => {
    if (location.state && location.state.newRoomCreated) {
      // Refresh my rooms list if a new room was created
      const storedRooms = localStorage.getItem('myRooms');
      if (storedRooms) {
        const parsedRooms = JSON.parse(storedRooms);
        setMyRooms(parsedRooms);
      }
      // Clear the state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Animation for stats
  useEffect(() => {
    const animateStats = () => {
      const duration = 1500; // milliseconds
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        setAnimatedStats({
          studyHours: Math.floor((userStats.studyHours * step) / steps),
          xp: Math.floor((userStats.xp * step) / steps),
          rank: Math.floor((userStats.rank * step) / steps),
          totalBadges: Math.floor((userStats.totalBadges * step) / steps)
        });
        
        if (step >= steps) clearInterval(timer);
      }, interval);
      
      return () => clearInterval(timer);
    };
    
    animateStats();
  }, []);
  
  // Get user's name for greeting
  const getUserName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    
    return 'Student';
  };

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleJoinRoom = (room: RoomData) => {
    setSelectedRoom(room);
    setShowJoinModal(true);
  };

  const handleJoinWithMode = () => {
    if (selectedRoom) {
      // Save user preferences
      localStorage.setItem('joinSettings', JSON.stringify(joinSettings));
      
      // Navigate directly to the room instead of showing confirmation
      handleFinalJoin();
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const allRooms = [...trendingRooms, ...myRooms, ...bookmarkedRooms];
    const filtered = allRooms.filter(room => 
      room.name.toLowerCase().includes(query) ||
      room.category.toLowerCase().includes(query) ||
      room.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setFilteredRooms(filtered);
  };

  const handleBookmark = (roomId: number) => {
    // In a real app, this would update the backend
    console.log(`Bookmarked room ${roomId}`);
  };

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    switch(section) {
      case 'browse':
        setActiveTab('trending');
        setFilteredRooms(trendingRooms);
        break;
      case 'my-rooms':
        setActiveTab('my-rooms');
        setFilteredRooms(myRooms);
        break;
      case 'bookmarks':
        setActiveTab('bookmarks');
        setFilteredRooms(bookmarkedRooms);
        break;
      case 'leaderboard':
        setActiveTab('leaderboard');
        break;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleFinalJoin = () => {
    if (selectedRoom) {
      navigate(`/room/${selectedRoom.id}`, {
        state: {
          room: selectedRoom,
          joinMode,
          settings: joinSettings
        }
      });
    }
  };

  return (
    <div className="dashboard-classic" style={{ padding: 0, margin: 0, overflow: 'hidden' }}>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'show' : ''}`}>
        <div className="mobile-sidebar-header">
          <div className="logo">
            <img src="/logo.png" alt="Slora" className="logo-img" />
            <span className="logo-text">Slora</span>
          </div>
          <button 
            className="close-menu-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="mobile-sidebar-content">
          <div className="mobile-user-info">
            <img 
              src={currentUser?.photoURL || "https://ui-avatars.com/api/?name=User&background=random"} 
              alt={currentUser?.displayName || "User"} 
              className="avatar-img"
            />
            <div className="user-details">
              <h4>{currentUser?.displayName || "User"}</h4>
              <p>{currentUser?.email}</p>
            </div>
          </div>
          <ul className="mobile-nav-menu">
            <li className={activeSection === 'dashboard' ? 'active' : ''}>
              <a href="#dashboard" onClick={() => { setActiveSection('dashboard'); closeMobileMenu(); }}>
                <i className="fa fa-home"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className={activeSection === 'rooms' ? 'active' : ''}>
              <a href="#rooms" onClick={() => { setActiveSection('rooms'); closeMobileMenu(); }}>
                <i className="fa fa-video"></i>
                <span>Study Rooms</span>
              </a>
            </li>
            <li className={activeSection === 'progress' ? 'active' : ''}>
              <a href="#progress" onClick={() => { setActiveSection('progress'); closeMobileMenu(); }}>
                <i className="fa fa-chart-line"></i>
                <span>Progress</span>
              </a>
            </li>
            <li className={activeSection === 'leaderboard' ? 'active' : ''}>
              <a href="#leaderboard" onClick={() => { setActiveSection('leaderboard'); closeMobileMenu(); }}>
                <i className="fa fa-trophy"></i>
                <span>Leaderboard</span>
              </a>
            </li>
            <li className={activeSection === 'settings' ? 'active' : ''}>
              <a href="#settings" onClick={() => { setActiveSection('settings'); closeMobileMenu(); }}>
                <i className="fa fa-cog"></i>
                <span>Settings</span>
              </a>
            </li>
          </ul>
          <div className="mobile-sidebar-footer">
            <button className="logout-btn" onClick={logOut}>
              <i className="fa fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header" style={{ margin: 0, padding: 0 }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            {/* Logo */}
            <div className="logo">
              <img src="/assets/images/logo.svg" alt="Slora Logo" className="logo-img" />
              <span className="logo-text">Slora</span>
            </div>
            
            {/* Search */}
            <div className="search-container ms-4">
              <input 
                type="text" 
                className="form-control search-input" 
                placeholder="Search rooms, topics, or users..." 
                value={searchQuery}
                onChange={handleSearch}
              />
              <i className="fa fa-search search-icon"></i>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn d-md-none ms-auto"
              aria-label="Toggle mobile menu"
              onClick={toggleMobileMenu}
            >
              <i className="fa fa-bars"></i>
            </button>
            
            {/* User Menu */}
            <div className="user-menu d-none d-md-flex">
              <div className="notification-icon me-3">
                <i className="fa fa-bell"></i>
                <span className="badge rounded-pill bg-danger">3</span>
              </div>
              <div className="user-dropdown">
                <img src={currentUser?.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"} alt="User Profile" className="avatar-img" />
                <span className="ms-2 username">{getUserName()}</span>
                <i className="fa fa-chevron-down ms-2"></i>
                
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <i className="fa fa-user me-2"></i> Profile
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => navigate('/settings')}
                  >
                    <i className="fa fa-cog me-2"></i> Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <i className="fa fa-sign-out-alt me-2"></i> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Navigation */}
      <nav className="main-navigation" style={{ top: '70px', margin: 0, padding: 0 }}>
        <div className="container-fluid">
          <ul className="nav-menu">
            <li className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}>
              <a href="#dashboard" onClick={() => handleNavigation('dashboard')}>
                <i className="fa fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className={`nav-item ${activeSection === 'browse' ? 'active' : ''}`}>
              <a href="#browse" onClick={() => handleNavigation('browse')}>
                <i className="fa fa-search"></i>
                <span>Browse Rooms</span>
              </a>
            </li>
            <li className={`nav-item ${activeSection === 'my-rooms' ? 'active' : ''}`}>
              <a href="#my-rooms" onClick={() => handleNavigation('my-rooms')}>
                <i className="fa fa-users"></i>
                <span>My Rooms</span>
              </a>
            </li>
            <li className={`nav-item ${activeSection === 'bookmarks' ? 'active' : ''}`}>
              <a href="#bookmarks" onClick={() => handleNavigation('bookmarks')}>
                <i className="fa fa-bookmark"></i>
                <span>Bookmarks</span>
              </a>
            </li>
            <li className={`nav-item ${activeSection === 'leaderboard' ? 'active' : ''}`}>
              <a href="#leaderboard" onClick={() => handleNavigation('leaderboard')}>
                <i className="fa fa-trophy"></i>
                <span>Leaderboard</span>
              </a>
            </li>
          </ul>
          
          {/* Mobile User Menu */}
          <div className={`mobile-user-menu d-md-none ${isMobileMenuOpen ? 'show' : ''}`}>
            <div className="notification-icon">
              <i className="fa fa-bell"></i>
              <span className="badge rounded-pill bg-danger">3</span>
            </div>
            <div className="user-dropdown">
              <img 
                src={currentUser?.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"} 
                alt="User Profile" 
                className="avatar-img" 
              />
              <span className="username">{getUserName()}</span>
              <i className="fa fa-chevron-down"></i>
              
              <div className="dropdown-menu">
                <button 
                  className="dropdown-item"
                  onClick={handleProfileClick}
                >
                  <i className="fa fa-user me-2"></i> Profile
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => navigate('/settings')}
                >
                  <i className="fa fa-cog me-2"></i> Settings
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <i className="fa fa-sign-out-alt me-2"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="container-fluid px-0">
          {/* Welcome Section */}
          <div className="welcome-section mb-4">
            <div className="welcome-header">
              <div className="welcome-text">
                <h2>Welcome back, {getUserName()}!</h2>
                <p className="welcome-message">Continue your learning journey and connect with others.</p>
              </div>
              <Button 
                variant="primary" 
                className="create-room-btn"
                onClick={handleCreateRoom}
              >
                <i className="fa fa-plus me-2"></i>Create Room
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="stats-card study-time">
                <div className="stats-icon">
                  <div className="icon-circle">
                    <i className="fa fa-clock"></i>
                  </div>
                </div>
                <div className="stats-info">
                  <h5>Study Time</h5>
                  <div className="stats-main">
                    <p className="stats-value">{animatedStats.studyHours}</p>
                    <span className="stats-unit">hours</span>
                  </div>
                  <div className="stats-trend">
                    <span className="trend-icon positive">
                      <i className="fa fa-arrow-up"></i>
                    </span>
                    <span className="trend-value">12%</span>
                    <span className="trend-label">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="stats-card rooms-joined">
                <div className="stats-icon">
                  <div className="icon-circle">
                    <i className="fa fa-users"></i>
                  </div>
                </div>
                <div className="stats-info">
                  <h5>Rooms Joined</h5>
                  <div className="stats-main">
                    <p className="stats-value">{animatedStats.totalBadges}</p>
                    <span className="stats-unit">rooms</span>
                  </div>
                  <div className="stats-trend">
                    <span className="trend-icon positive">
                      <i className="fa fa-arrow-up"></i>
                    </span>
                    <span className="trend-value">8%</span>
                    <span className="trend-label">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="stats-card achievements">
                <div className="stats-icon">
                  <div className="icon-circle">
                    <i className="fa fa-medal"></i>
                  </div>
                </div>
                <div className="stats-info">
                  <h5>Achievements</h5>
                  <div className="stats-main">
                    <p className="stats-value">{animatedStats.totalBadges}</p>
                    <span className="stats-unit">badges</span>
                  </div>
                  <div className="stats-trend">
                    <span className="trend-icon neutral">
                      <i className="fa fa-minus"></i>
                    </span>
                    <span className="trend-value">Same</span>
                    <span className="trend-label">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="stats-card streak">
                <div className="stats-icon">
                  <div className="icon-circle">
                    <i className="fa fa-fire"></i>
                  </div>
                </div>
                <div className="stats-info">
                  <h5>Study Streak</h5>
                  <div className="stats-main">
                    <p className="stats-value">7</p>
                    <span className="stats-unit">days</span>
                  </div>
                  <div className="stats-trend">
                    <span className="trend-icon positive">
                      <i className="fa fa-arrow-up"></i>
                    </span>
                    <span className="trend-value">+2</span>
                    <span className="trend-label">vs last week</span>
                  </div>
                </div>
              </div>
              </div>
              </div>
          
          <Row>
            {/* Main Content */}
            <Col lg={8}>
              {/* Rooms Tabs */}
              <Card className="mb-4">
                <Card.Header className="bg-white border-bottom-0 pt-3 px-4">
                  <Nav variant="tabs" defaultActiveKey={activeTab} onSelect={(key) => setActiveTab(key || "trending")}>
                    <Nav.Item>
                      <Nav.Link eventKey="trending">Trending Rooms</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="recommended">Recommended</Nav.Link>
                    </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="my-rooms">My Rooms</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                      <Nav.Link eventKey="bookmarks">Bookmarks</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
                <Card.Body className="pt-2 px-4 pb-4">
                  {/* Categories */}
                  <div className="category-filters mb-4">
                    <Button 
                      variant={activeCategory === "all" ? "primary" : "outline-secondary"} 
                      className="me-2 mb-2 category-btn"
                      onClick={() => setActiveCategory("all")}
                    >
                      All
                    </Button>
                    <Button 
                      variant={activeCategory === "computer-science" ? "primary" : "outline-secondary"} 
                      className="me-2 mb-2 category-btn"
                      onClick={() => setActiveCategory("computer-science")}
                    >
                      Computer Science
                    </Button>
                    <Button 
                      variant={activeCategory === "medicine" ? "primary" : "outline-secondary"} 
                      className="me-2 mb-2 category-btn"
                      onClick={() => setActiveCategory("medicine")}
                    >
                      Medicine
                    </Button>
                    <Button 
                      variant={activeCategory === "mathematics" ? "primary" : "outline-secondary"} 
                      className="me-2 mb-2 category-btn"
                      onClick={() => setActiveCategory("mathematics")}
                    >
                      Mathematics
                    </Button>
                    <Button 
                      variant={activeCategory === "language" ? "primary" : "outline-secondary"} 
                      className="me-2 mb-2 category-btn"
                      onClick={() => setActiveCategory("language")}
                    >
                      Languages
                    </Button>
                  </div>
                  
                  {/* Room Cards */}
                  <div className="room-grid">
                    {activeTab === "leaderboard" ? (
                      <div className="leaderboard-list">
                        {leaderboardData.map((user, index) => (
                          <div key={user.id} className="leaderboard-item">
                            <div className="rank">{index + 1}</div>
                            <img src={user.avatar} alt={user.name} className="user-avatar" />
                            <div className="user-info">
                              <div className="user-name">{user.name}</div>
                              <div className="user-stats">
                                <span>Level {user.level}</span>
                                <span>{user.xp} XP</span>
                                <span>{user.streak} day streak</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      filteredRooms.map(room => (
                        <div className="room-card-wrapper" key={room.id}>
                          <Card className="room-card h-100">
                            <div className="room-card-image">
                              <Card.Img 
                                variant="top" 
                                src={room.image || "/assets/images/room-placeholder.jpg"} 
                                alt={room.name} 
                              />
                              <div className="room-card-badges">
                          {room.isLive && (
                                  <Badge bg="danger" className="me-2 live-badge">
                                    <i className="fas fa-circle me-1"></i> LIVE
                            </Badge>
                          )}
                                <Badge bg="primary">{room.participants} Studying</Badge>
                              </div>
                        </div>
                            <Card.Body>
                              <Card.Title className="room-name">{room.name}</Card.Title>
                              <div className="room-meta">
                                <span><i className="fas fa-tag me-1"></i> {room.category}</span>
                                <span><i className="fas fa-users me-1"></i> {room.participants} joined</span>
                        </div>
                              <div className="room-tags">
                          {room.tags.map((tag, index) => (
                                  <Badge bg="light" text="dark" className="room-tag" key={index}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                              <div className="room-host">
                                <Image 
                                  src={room.host.avatar} 
                                  roundedCircle 
                                  width={30} 
                                  height={30} 
                                  className="host-avatar"
                                  alt={room.host.name}
                                />
                                <span className="host-name">{room.host.name}</span>
                                <span className="host-level">Lvl {room.host.level}</span>
                              </div>
                            </Card.Body>
                            <Card.Footer className="bg-white border-top-0">
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  className="flex-grow-1"
                                  onClick={() => handleBookmark(room.id)}
                                >
                                  <i className="fa fa-bookmark"></i>
                                </Button>
                          <Button 
                            variant="primary" 
                                  className="flex-grow-1"
                                  onClick={() => handleJoinRoom(room)}
                                >
                                  {room.isLive ? 'Join Now' : 'View Room'}
                                </Button>
                              </div>
                            </Card.Footer>
                          </Card>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* See More Button */}
                  <div className="text-center mt-4">
                    <Button variant="outline-primary" className="see-more-btn">
                      See More Rooms
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Sidebar */}
            <Col lg={4}>
              {/* Progress Card */}
              <Card className="mb-4 progress-card">
                <Card.Body>
                  <Card.Title className="mb-4">Your Progress</Card.Title>
                  <div className="level-info">
                    <div className="level-badge">{userStats.level}</div>
                    <div className="level-details">
                      <div className="level-progress-info">
                        <div className="level-label">Level {userStats.level}</div>
                        <div className="xp-counter">{userStats.xp}/{userStats.xpToNextLevel} XP</div>
                      </div>
                      <ProgressBar 
                        className="level-progress-bar" 
                        now={(userStats.xp / userStats.xpToNextLevel) * 100} 
                        variant="primary"
                      />
                    </div>
                  </div>
                  
                  <div className="achievements-title">Achievements in Progress</div>
                  <div className="achievements-list">
                    {userStats.achievements.map(achievement => (
                      <div className="achievement-item" key={achievement.id}>
                        <div className="achievement-icon" style={{ background: achievement.iconBg }}>
                          <i className={`fas fa-${achievement.icon}`}></i>
                        </div>
                        <div className="achievement-info">
                          <div className="achievement-header">
                            <div className="achievement-name">{achievement.name}</div>
                            <div className="achievement-percentage">{achievement.progress}%</div>
                          </div>
                          <ProgressBar 
                            className="achievement-progress" 
                            now={achievement.progress} 
                            variant="success"
                          />
                          <div className="achievement-description">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline-primary" className="view-all-btn w-100 mt-3">
                    View All Achievements
                          </Button>
                </Card.Body>
              </Card>
              
              {/* Upcoming Events Card */}
              <Card className="upcoming-card">
                <Card.Body>
                  <Card.Title className="mb-4">Upcoming Sessions</Card.Title>
                  <div className="upcoming-list">
                    {upcomingRooms.map(room => (
                      <div className="upcoming-item" key={room.id}>
                        <div className="upcoming-time">
                          <i className="far fa-calendar-alt me-1"></i> {room.time}
                        </div>
                        <div className="upcoming-details">
                          <div className="upcoming-name">{room.name}</div>
                          <div className="upcoming-meta">
                            <span className="upcoming-category">{room.category}</span>
                            <div className="upcoming-host">
                              <Image 
                                src={room.host.avatar} 
                                roundedCircle 
                                width={20} 
                                height={20} 
                                alt={room.host.name}
                              />
                              <span>{room.host.name}</span>
                            </div>
                          </div>
                          <Button variant="outline-primary" size="sm" className="upcoming-btn mt-2">
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline-primary" className="view-all-btn w-100 mt-3">
                    View Full Schedule
                  </Button>
                      </Card.Body>
                    </Card>
                  </Col>
              </Row>
        </div>
      </div>
      
      {/* Join Room Modal */}
      <Modal 
        show={showJoinModal} 
        onHide={() => setShowJoinModal(false)}
        centered
        size="lg"
        className="join-room-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Join Study Room</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedRoom && (
            <div className="join-room-modal-content">
              {/* Room Preview */}
              <div className="room-preview-section">
                <div className="room-image">
                  <img 
                    src={selectedRoom.image || "/assets/images/room-placeholder.jpg"} 
                    alt={selectedRoom.name} 
                  />
                  <div className="room-status">
                    {selectedRoom.isLive ? (
                      <span className="live-status">
                        <i className="fas fa-circle"></i> Live Now
                      </span>
                    ) : (
                      <span className="scheduled-status">
                        <i className="far fa-clock"></i> Scheduled
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="room-info">
                  <h3 className="room-name">{selectedRoom.name}</h3>
                  <div className="room-meta-info">
                    <Badge bg="primary" className="room-category">
                      <i className="fas fa-tag me-1"></i> {selectedRoom.category}
                    </Badge>
                    <span className="participants">
                      <i className="fas fa-users me-1"></i> {selectedRoom.participants} Studying
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="room-details-section">
                <div className="section-title">
                  <i className="fas fa-info-circle me-2"></i> Room Details
                </div>
                <div className="details-grid">
                  <div className="detail-item">
                    <i className="fas fa-user-graduate"></i>
                    <div className="detail-content">
                      <span className="detail-label">Host</span>
                      <span className="detail-value">{selectedRoom.host.name}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-star"></i>
                    <div className="detail-content">
                      <span className="detail-label">Host Level</span>
                      <span className="detail-value">Level {selectedRoom.host.level}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <div className="detail-content">
                      <span className="detail-label">Duration</span>
                      <span className="detail-value">2 hours</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-book"></i>
                    <div className="detail-content">
                      <span className="detail-label">Topic</span>
                      <span className="detail-value">{selectedRoom.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Options */}
              <div className="join-options-section">
                <div className="section-title">
                  <i className="fas fa-video me-2"></i> Join Options
                </div>
                <div className="join-mode-selector">
                  <Button 
                    variant={joinMode === "video" ? "primary" : "outline-secondary"}
                    className={`join-mode-btn ${joinMode === "video" ? "active" : ""}`}
                    onClick={() => setJoinMode("video")}
                  >
                    <i className="fas fa-video mb-2"></i>
                    <span>Video & Audio</span>
                  </Button>
                  
                  <Button 
                    variant={joinMode === "audio" ? "primary" : "outline-secondary"}
                    className={`join-mode-btn ${joinMode === "audio" ? "active" : ""}`}
                    onClick={() => setJoinMode("audio")}
                  >
                    <i className="fas fa-microphone mb-2"></i>
                    <span>Audio Only</span>
                  </Button>
                  
                  <Button 
                    variant={joinMode === "watch" ? "primary" : "outline-secondary"}
                    className={`join-mode-btn ${joinMode === "watch" ? "active" : ""}`}
                    onClick={() => setJoinMode("watch")}
                  >
                    <i className="fas fa-eye mb-2"></i>
                    <span>Watch Only</span>
                  </Button>
                </div>
              </div>

              {/* Join Settings */}
              <div className="join-settings-section">
                <div className="section-title">
                  <i className="fas fa-cog me-2"></i> Join Settings
                </div>
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Enable Video</span>
                      <span className="setting-description">Show your video to others</span>
                    </div>
                    <Form.Check
                      type="switch"
                      checked={joinSettings.videoEnabled}
                      onChange={(e) => setJoinSettings({...joinSettings, videoEnabled: e.target.checked})}
                    />
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Enable Audio</span>
                      <span className="setting-description">Allow others to hear you</span>
                    </div>
                    <Form.Check
                      type="switch"
                      checked={joinSettings.audioEnabled}
                      onChange={(e) => setJoinSettings({...joinSettings, audioEnabled: e.target.checked})}
                    />
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Enable Chat</span>
                      <span className="setting-description">Participate in room chat</span>
                    </div>
                    <Form.Check
                      type="switch"
                      checked={joinSettings.chatEnabled}
                      onChange={(e) => setJoinSettings({...joinSettings, chatEnabled: e.target.checked})}
                    />
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Enable Notifications</span>
                      <span className="setting-description">Get notified about room events</span>
                    </div>
                    <Form.Check
                      type="switch"
                      checked={joinSettings.notificationsEnabled}
                      onChange={(e) => setJoinSettings({...joinSettings, notificationsEnabled: e.target.checked})}
                    />
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Record Session</span>
                      <span className="setting-description">Save the session for later</span>
                    </div>
                    <Form.Check
                      type="switch"
                      checked={joinSettings.recordingEnabled}
                      onChange={(e) => setJoinSettings({...joinSettings, recordingEnabled: e.target.checked})}
                    />
                  </div>
                </div>
              </div>

              {/* Room Tags */}
              <div className="room-tags-section">
                <div className="section-title">
                  <i className="fas fa-tags me-2"></i> Topics
                </div>
                <div className="tags-container">
                  {selectedRoom.tags.map((tag, index) => (
                    <Badge bg="light" text="dark" className="room-tag" key={index}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowJoinModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleJoinWithMode}>
            <i className="fas fa-sign-in-alt me-2"></i> Join Now
                </Button>
        </Modal.Footer>
      </Modal>

      {/* Join Confirmation Modal */}
      <Modal 
        show={showJoinConfirmation} 
        onHide={() => setShowJoinConfirmation(false)}
        centered
        size="lg"
        className="join-confirmation-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Ready to Join?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="join-confirmation-content">
            {/* Room Preview */}
            <div className="room-preview-section">
              <div className="room-image">
                <img 
                  src={selectedRoom?.image || "/assets/images/room-placeholder.jpg"} 
                  alt={selectedRoom?.name} 
                />
                <div className="room-status">
                  {selectedRoom?.isLive ? (
                    <span className="live-status">
                      <i className="fas fa-circle"></i> Live Now
                    </span>
                  ) : (
                    <span className="scheduled-status">
                      <i className="far fa-clock"></i> Scheduled
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Join Summary */}
            <div className="join-summary-section">
              <div className="summary-header">
                <h3>{selectedRoom?.name}</h3>
                <div className="join-mode-badge">
                  <i className={`fas fa-${joinMode === 'video' ? 'video' : joinMode === 'audio' ? 'microphone' : 'eye'}`}></i>
                  <span>{joinMode === 'video' ? 'Video & Audio' : joinMode === 'audio' ? 'Audio Only' : 'Watch Only'}</span>
                </div>
              </div>

              <div className="summary-details">
                <div className="detail-row">
                  <span className="detail-label">Host</span>
                  <span className="detail-value">{selectedRoom?.host.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Participants</span>
                  <span className="detail-value">{selectedRoom?.participants} Studying</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{selectedRoom?.category}</span>
                </div>
              </div>

              {/* Settings Summary */}
              <div className="settings-summary">
                <h4>Your Settings</h4>
                <div className="settings-grid">
                  <div className="setting-item">
                    <i className={`fas fa-${joinSettings.videoEnabled ? 'video' : 'video-slash'}`}></i>
                    <span>Video {joinSettings.videoEnabled ? 'On' : 'Off'}</span>
                  </div>
                  <div className="setting-item">
                    <i className={`fas fa-${joinSettings.audioEnabled ? 'microphone' : 'microphone-slash'}`}></i>
                    <span>Audio {joinSettings.audioEnabled ? 'On' : 'Off'}</span>
                  </div>
                  <div className="setting-item">
                    <i className={`fas fa-${joinSettings.chatEnabled ? 'comments' : 'comment-slash'}`}></i>
                    <span>Chat {joinSettings.chatEnabled ? 'On' : 'Off'}</span>
                  </div>
                  <div className="setting-item">
                    <i className={`fas fa-${joinSettings.notificationsEnabled ? 'bell' : 'bell-slash'}`}></i>
                    <span>Notifications {joinSettings.notificationsEnabled ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <button className="action-btn" onClick={() => setShowJoinConfirmation(false)}>
                  <i className="fas fa-cog"></i>
                  <span>Change Settings</span>
                </button>
                <button className="action-btn" onClick={() => setShowJoinConfirmation(false)}>
                  <i className="fas fa-clock"></i>
                  <span>Set Reminder</span>
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowJoinConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFinalJoin} className="join-now-btn">
            <i className="fas fa-sign-in-alt me-2"></i> Join Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard; 