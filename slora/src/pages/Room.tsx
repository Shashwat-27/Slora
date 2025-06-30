import React, { Fragment, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Image, Nav, Tab, ProgressBar, Dropdown, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RoomParticipant as RoomParticipantType } from '../services/RoomService';
import { FaCheck } from 'react-icons/fa';
import '../styles/Room.css';

// Use the RoomParticipant interface from RoomService, make joinedAt optional
type RoomParticipant = Omit<RoomParticipantType, 'joinedAt'> & {
  joinedAt?: string;
};

// Update the AuthContext type definition
interface AuthUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
}

// Type definitions for mockRoomData to fix TypeScript errors
interface RoomData {
  id: string | number;
  title?: string;
  name?: string;
  description?: string;
  host: {
    name: string;
    image?: string;
    avatar?: string;
    level?: number;
  };
  startTime?: string;
  endTime?: string;
  participants?: {
    name: string;
    image?: string;
    avatar?: string;
    status?: string;
  }[];
  tags: string[];
  mode?: string;
  status?: string;
  category?: string;
  image?: string;
  isLive?: boolean;
  createdAt?: string;
  maxParticipants?: number;
}

interface MockRoomDataType {
  [key: string]: RoomData;
}

// Update mockRoomData type
const mockRoomData: MockRoomDataType = {
  "room-123": {
    id: "room-123",
    title: "Advanced Calculus Study Session",
    description: "Join us for an in-depth study of limits, derivatives, and integrals.",
    host: {
      name: "Professor Smith",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    startTime: "2023-05-15T14:00:00Z",
    endTime: "2023-05-15T16:00:00Z",
    participants: [
      { name: "Professor Smith", image: "https://randomuser.me/api/portraits/men/32.jpg", status: "Speaking" },
      { name: "Alice Johnson", image: "https://randomuser.me/api/portraits/women/44.jpg", status: "Working on problem 3" },
      { name: "Bob Wilson", image: "https://randomuser.me/api/portraits/men/42.jpg", status: "Taking notes" },
      { name: "Carol Martinez", image: "https://randomuser.me/api/portraits/women/45.jpg", status: "Away" }
    ],
    tags: ["calculus", "mathematics", "derivatives", "integrals"],
    mode: "group",
    status: "active"
  },
  "room-456": {
    id: "room-456",
    title: "History of Art Discussion",
    description: "Exploring Renaissance art and its influence on modern aesthetics.",
    host: {
      name: "Dr. Johnson",
      image: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    startTime: "2023-05-16T10:00:00Z",
    endTime: "2023-05-16T12:00:00Z",
    participants: [
      { name: "Dr. Johnson", image: "https://randomuser.me/api/portraits/women/33.jpg" },
      { name: "Mark Davis", image: "https://randomuser.me/api/portraits/men/45.jpg" },
      { name: "Sarah Wong", image: "https://randomuser.me/api/portraits/women/46.jpg" }
    ],
    tags: ["art", "history", "renaissance", "aesthetics"],
    mode: "discussion",
    status: "scheduled"
  }
};

// Mock active tasks for collaboration
const mockTasks = [
  {
    id: 1,
    title: 'Review Binary Search implementation',
    description: 'Analyze time and space complexity of our implementation',
    assignee: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    status: 'In Progress',
    priority: 'High',
    dueDate: '2023-04-30'
  },
  {
    id: 2,
    title: 'Solve LeetCode problem #217',
    description: 'Contains Duplicate - Find if array has any duplicates',
    assignee: null,
    status: 'To Do',
    priority: 'Medium',
    dueDate: '2023-05-01'
  },
  {
    id: 3,
    title: 'Implement merge sort algorithm',
    description: 'Code and test the algorithm with various inputs',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2023-04-28'
  }
];

// Mock resources
const mockResources = [
  {
    id: 1,
    title: 'Data Structures Cheatsheet',
    type: 'document',
    url: '#',
    uploadedBy: {
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    uploadedAt: '2 days ago'
  },
  {
    id: 2,
    title: 'Solutions to Common Algorithm Problems',
    type: 'link',
    url: 'https://github.com/username/algorithms',
    uploadedBy: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    uploadedAt: '1 day ago'
  },
  {
    id: 3,
    title: 'Algorithms for Competitive Programming',
    type: 'pdf',
    url: '#',
    uploadedBy: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    uploadedAt: '3 hours ago'
  }
];

// Update RoomParams interface to fix TypeScript error
interface RoomParams {
  roomId: string;
  [key: string]: string;  // Add index signature for string keys
}

interface RoomState {
  room: RoomData;
  joinMode: 'audio' | 'watch';
  settings: {
    audioEnabled: boolean;
    chatEnabled: boolean;
    notificationsEnabled: boolean;
    recordingEnabled: boolean;
  };
}

// Add device selection modal component
const DeviceSelectionModal: React.FC<{
  show: boolean;
  onHide: () => void;
  onSelectDevice: (deviceType: 'camera' | 'microphone', deviceId: string) => void;
  devices: {
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
  }
}> = ({ show, onHide, onSelectDevice, devices }) => {
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');

  useEffect(() => {
    // Set default selected devices
    if (devices.cameras.length > 0 && !selectedCamera) {
      setSelectedCamera(devices.cameras[0].deviceId);
    }
    if (devices.microphones.length > 0 && !selectedMicrophone) {
      setSelectedMicrophone(devices.microphones[0].deviceId);
    }
  }, [devices, selectedCamera, selectedMicrophone]);

  const handleApply = () => {
    if (selectedCamera) {
      onSelectDevice('camera', selectedCamera);
    }
    if (selectedMicrophone) {
      onSelectDevice('microphone', selectedMicrophone);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Devices</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="camera-select">Camera</Form.Label>
            <Form.Select 
              id="camera-select"
              aria-label="Select camera"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}>
              {devices.cameras.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${devices.cameras.indexOf(device) + 1}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="microphone-select">Microphone</Form.Label>
            <Form.Select 
              id="microphone-select"
              aria-label="Select microphone"
              value={selectedMicrophone}
              onChange={(e) => setSelectedMicrophone(e.target.value)}>
              {devices.microphones.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${devices.microphones.indexOf(device) + 1}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleApply}>Apply</Button>
      </Modal.Footer>
    </Modal>
  );
};

const Room: React.FC = () => {
  const { roomId } = useParams<RoomParams>();
  const navigate = useNavigate();
  const { currentUser: user } = useAuth();
  const location = useLocation();
  const [showJoinOptions, setShowJoinOptions] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [showParticipants, setShowParticipants] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('study');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  const [tasks, setTasks] = useState(mockTasks);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: ''
  });
  const [resources, setResources] = useState(mockResources);
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'link',
    url: ''
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [roomState, setRoomState] = useState<RoomState>({
    room: roomId ? mockRoomData[roomId] || mockRoomData["room-123"] : mockRoomData["room-123"],
    joinMode: 'audio',
    settings: {
      audioEnabled: true,
      chatEnabled: true,
      notificationsEnabled: true,
      recordingEnabled: false
    }
  });
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  
  const roomParticipants = useMemo(() => {
    return roomState.room.participants || [];
  }, [roomState.room]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the room
  useEffect(() => {
    // Load the room data
    if (roomId && mockRoomData[roomId]) {
      setRoomState(prev => ({
        ...prev,
        room: mockRoomData[roomId]
      }));
    }

    // Setup messages
    setMessages([
      {
        id: 1,
        sender: {
          name: 'Alice Johnson',
          image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        message: 'Hello everyone! I just joined this study session.',
        time: '10:30 AM'
      },
      {
        id: 2,
        sender: {
          name: 'Professor Smith',
          image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        message: 'Welcome Alice! We were just discussing the chain rule.',
        time: '10:32 AM'
      },
      {
        id: 3,
        sender: {
          name: 'Bob Wilson',
          image: 'https://randomuser.me/api/portraits/men/42.jpg'
        },
        message: "I'm still confused about implicit differentiation. Can we go over that again?",
        time: '10:35 AM'
      }
    ]);

    // Initialize participants
    if (roomState.room.participants) {
      const mappedParticipants: RoomParticipant[] = roomState.room.participants.map((p, index) => ({
        id: index.toString(),
        name: p.name,
        avatar: p.image || '',
        status: p.status || 'Online',
        isHost: index === 0,
        level: Math.floor(Math.random() * 10) + 1,
        joinedAt: new Date().toISOString()
      }));
      setParticipants(mappedParticipants);
    }

    return () => {
      // Cleanup when leaving the room
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [roomId]);

  // Join the room
  const handleJoinRoom = (mode: 'audio' | 'watch') => {
    // Set the join mode
    setRoomState(prev => ({
      ...prev,
      joinMode: mode
    }));

    // Add current user to participants if not already there
    if (user && !participants.some(p => p.id === user.uid)) {
      const newParticipant: RoomParticipant = {
        id: user.uid,
        name: user.displayName || 'You',
        avatar: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
        status: 'Online',
        isHost: false,
        level: 1,
        joinedAt: new Date().toISOString()
      };

      setParticipants(prev => [...prev, newParticipant]);
    }

    // Start the timer
    if (!timerActive) {
      toggleTimer();
    }

    // Set has joined
    setHasJoined(true);
  };

  // Handle sending a chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: {
        name: user?.displayName || 'You',
        image: user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
      },
      message: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  // Handle leaving the room
  const handleLeaveRoom = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setHasJoined(false);
    navigate('/dashboard');
  };

  // Toggle the timer on/off
  const toggleTimer = () => {
    if (timerActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    setTimerActive(prev => !prev);
  };

  // Format the timer value
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let formattedTime = '';
    
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    
    if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes}m `;
    }
    
    formattedTime += `${secs}s`;
    
    return formattedTime;
  };

  // Handle notes saving
  const handleSaveNotes = () => {
    // Here we would normally save notes to a database
    console.log('Saving notes:', notes);
    // Show a success toast or notification
    setSavedNotes(true);
    setTimeout(() => {
      setSavedNotes(false);
    }, 3000);
  };

  // Task management
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      assignee: user ? {
        name: user.displayName || 'You',
        avatar: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
      } : null,
      status: 'To Do',
      priority: newTask.priority,
      dueDate: newTask.dueDate
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: ''
    });
    setShowTaskForm(false);
  };

  const handleChangeTaskStatus = (taskId: number, status: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const handleAssignTask = (taskId: number) => {
    if (!user) return;
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { 
        ...task, 
        assignee: {
          name: user.displayName || 'You',
          avatar: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
        }
      } : task
    ));
  };

  // Resource management
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.url.trim()) return;
    
    const resource = {
      id: resources.length + 1,
      title: newResource.title,
      type: newResource.type,
      url: newResource.url,
      uploadedBy: user ? {
        name: user.displayName || 'You',
        avatar: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
      } : {
        name: 'Anonymous',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
      },
      uploadedAt: 'Just now'
    };
    
    setResources(prev => [...prev, resource]);
    setNewResource({
      title: '',
      type: 'link',
      url: ''
    });
    setShowResourceForm(false);
  };

  // Handle inviting users
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    // Here we would normally send an invitation email
    console.log('Inviting user:', inviteEmail);
    
    // Show a success message
    alert(`Invitation sent to ${inviteEmail}`);
    
    setInviteEmail('');
    setShowInviteModal(false);
  };

  // Task form UI
  const renderTaskForm = () => {
    return (
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Add Task</h6>
          <Button 
            variant="link" 
            className="p-0" 
            onClick={() => setShowTaskForm(false)}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddTask}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="task-title">Title</Form.Label>
              <Form.Control 
                id="task-title"
                type="text" 
                placeholder="Task title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label htmlFor="task-description">Description</Form.Label>
              <Form.Control 
                id="task-description"
                as="textarea" 
                rows={2} 
                placeholder="Task description" 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label id="task-priority-label">Priority</Form.Label>
                  <Form.Select
                    id="task-priority-select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    title="Task priority"
                    aria-label="Task priority"
                    aria-labelledby="task-priority-label"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="task-due-date">Due Date</Form.Label>
                  <Form.Control
                    id="task-due-date"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">Add Task</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  // Resource upload form UI
  const renderResourceUploadForm = () => {
    return (
      <Card className="mt-3 mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Upload New Resource</h5>
          <Button 
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowResourceForm(false)}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddResource}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="resource-title">Title</Form.Label>
              <Form.Control 
                id="resource-title"
                type="text" 
                placeholder="Resource title" 
                value={newResource.title}
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label htmlFor="resource-type-select" id="resource-type-label">Type</Form.Label>
              <Form.Select
                id="resource-type-select"
                value={newResource.type}
                onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                title="Resource type"
                aria-label="Resource type"
                aria-labelledby="resource-type-label"
              >
                <option value="document">Document</option>
                <option value="pdf">PDF</option>
                <option value="link">Link</option>
                <option value="video">Video</option>
                <option value="quiz">Quiz</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label htmlFor={newResource.type === 'link' ? "resource-url" : "resource-file"}>
                {newResource.type === 'link' ? 'URL' : 'Upload File'}
              </Form.Label>
              {newResource.type === 'link' ? (
                <Form.Control 
                  id="resource-url"
                  type="url" 
                  placeholder="https://" 
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  required
                />
              ) : (
                <Form.Control 
                  id="resource-file"
                  type="file" 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      // In a real app, you would handle file upload
                      setNewResource({...newResource, url: URL.createObjectURL(e.target.files[0])});
                    }
                  }}
                />
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" type="submit">Upload Resource</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  // Invite modal UI
  const renderInviteModal = () => {
    return (
      <div 
        className="invite-modal-overlay" 
        onClick={() => setShowInviteModal(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setShowInviteModal(false);
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
      >
        <section 
          className="invite-modal-content" 
          onClick={e => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="document"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0" id="invite-modal-title">Invite to Room</h5>
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => setShowInviteModal(false)}
              aria-label="Close invite modal"
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          </div>
          
          <Form onSubmit={handleInviteUser}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="invite-email">Email Address</Form.Label>
              <Form.Control 
                id="invite-email"
                type="email" 
                placeholder="Enter email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                They'll receive an invitation to join this study room.
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Send Invitation
              </Button>
            </div>
          </Form>
        </section>
      </div>
    );
  };

  // Update the tasks tab to use the local tasks state
  const renderTasksSection = () => {
    return (
      <div className="tasks-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 me-3" id="tasks-filter-label">Collaborative Tasks</h5>
            <Form.Select 
              id="tasks-filter-select"
              value={activeFilter} 
              onChange={(e) => setActiveFilter(e.target.value)}
              className="form-select-sm" 
              style={{ width: 'auto' }}
              title="Filter tasks"
              aria-label="Filter tasks"
              aria-labelledby="tasks-filter-label"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowTaskForm(true)}>
            <i className="bi bi-plus-lg me-2"></i>
            New Task
          </Button>
        </div>
        
        {showTaskForm && renderTaskForm()}
        
        {tasks
          .filter(task => 
            activeFilter === 'all' ? true : 
            activeFilter === 'completed' ? task.status === 'Completed' : 
            task.status !== 'Completed'
          )
          .map(task => (
            <Card key={task.id} className={`task-card mb-3 ${task.status === 'Completed' ? 'completed' : ''}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">{task.title}</h6>
                  <Dropdown>
                    <Dropdown.Toggle 
                      variant="light" 
                      size="sm" 
                      id={`status-dropdown-${task.id}`}
                      title="Change task status"
                      aria-label="Change task status"
                    >
                      <Badge 
                        bg={
                          task.status === 'Completed' ? 'success' : 
                          task.status === 'In Progress' ? 'warning' : 'secondary'
                        }
                      >
                        {task.status}
                      </Badge>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleChangeTaskStatus(task.id, 'To Do')}>
                        To Do
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleChangeTaskStatus(task.id, 'In Progress')}>
                        In Progress
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleChangeTaskStatus(task.id, 'Completed')}>
                        Completed
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <p className="small text-muted mb-3">{task.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {task.assignee ? (
                      <div className="d-flex align-items-center">
                        <Image 
                          src={task.assignee.avatar} 
                          alt={task.assignee.name}
                          width={24}
                          height={24}
                          roundedCircle
                          className="me-2"
                        />
                        <small>{task.assignee.name}</small>
                      </div>
                    ) : (
                      <Button variant="outline-primary" size="sm" onClick={() => handleAssignTask(task.id)}>
                        <i className="bi bi-person-plus me-1"></i>
                        Assign to Me
                      </Button>
                    )}
                  </div>
                  <div>
                    <Badge bg={
                      task.priority === 'High' ? 'danger' : 
                      task.priority === 'Medium' ? 'warning' : 'info'
                    } className="me-2">
                      {task.priority}
                    </Badge>
                    <small className="text-muted">Due: {task.dueDate}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
      </div>
    );
  };

  // Update resources tab to use local resources state
  const renderResourcesSection = () => {
    return (
      <div className="resources-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Shared Resources</h5>
          <Button variant="primary" size="sm" onClick={() => setShowResourceForm(true)}>
            <i className="bi bi-upload me-2"></i>
            Add Resource
          </Button>
        </div>
        
        {showResourceForm && renderResourceUploadForm()}
        
        {resources.map(resource => (
          <Card key={resource.id} className="resource-card mb-3">
            <Card.Body>
              <div className="d-flex">
                <div className="resource-icon me-3">
                  <i className={`bi ${
                    resource.type === 'document' ? 'bi-file-text' :
                    resource.type === 'pdf' ? 'bi-file-pdf' :
                    'bi-link-45deg'
                  }`}></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">{resource.title}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Image 
                        src={resource.uploadedBy.avatar} 
                        alt={resource.uploadedBy.name}
                        width={24}
                        height={24}
                        roundedCircle
                        className="me-2"
                      />
                      <small className="text-muted">
                        {resource.uploadedBy.name} • {resource.uploadedAt}
                      </small>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-download me-1"></i>
                      {resource.type === 'link' ? 'Open' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  // Update notes tab with save functionality
  const renderNotesSection = () => {
    return (
      <div className="notes-container">
        <Card>
          <Card.Body>
            <h5 className="mb-3">Collaborative Notes</h5>
            <Form.Label htmlFor="collaborative-notes" className="visually-hidden">Collaborative Notes</Form.Label>
            <Form.Control 
              id="collaborative-notes"
              as="textarea" 
              rows={10} 
              className="mb-3"
              placeholder="Take notes here... Everyone in the room can see and edit these notes in real-time."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              aria-label="Collaborative Notes"
            />
            <div className="d-flex justify-content-between align-items-center">
              {savedNotes && (
                <div className="text-success">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Notes saved!
                </div>
              )}
              <div className="ms-auto">
                <Button variant="primary" onClick={handleSaveNotes}>
                  <i className="bi bi-save me-2"></i>
                  Save Notes
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  // Use this function to get the room title for display
  const getRoomTitle = () => {
    if (roomState.room) {
      return roomState.room.title || roomState.room.name || `Room #${roomId}`;
    }
    return roomName || `Room #${roomId}`;
  };
  
  if (isLoading) {
    return (
      <Container className="room-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3>Joining Room...</h3>
          <p className="text-muted">Setting up your collaborative space</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container fluid className="room-container p-0">
      {showInviteModal && renderInviteModal()}
      
      <div className="room-header py-2 px-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            <h1 className="room-title mb-0">{getRoomTitle()}</h1>
            <Badge bg="success" className="ms-2 study-badge">Study Session</Badge>
            {roomState.room && roomState.room.category && (
              <Badge bg="info" className="ms-2">{roomState.room.category}</Badge>
            )}
          </div>
          <div className="d-flex align-items-center mt-2 mt-md-0">
            <div className="timer-container me-3">
              <div className="d-flex align-items-center">
            <Button 
                  variant={timerActive ? "danger" : "success"}
                  size="sm"
              className="me-2"
                  onClick={toggleTimer}
                >
                  <i className={`bi ${timerActive ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                </Button>
                <div className="timer-display">
                  <div className="timer-label small text-muted">Study Time</div>
                  <div className="timer-value">{formatTime(elapsedTime)}</div>
                </div>
              </div>
            </div>
            <Button 
              variant="outline-primary" 
              className="me-2"
              onClick={() => setShowInviteModal(true)}
            >
              <i className="bi bi-people-fill me-2"></i>
              Invite
            </Button>
            <Button 
              variant="danger" 
              onClick={handleLeaveRoom}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Leave Room
            </Button>
          </div>
        </div>
      </div>
      
      {roomState.room && (
        <div className="room-details-summary mt-2 p-2 bg-light rounded">
          <div className="d-flex flex-wrap">
            <div className="me-4 mb-1">
              <small className="text-muted">Host:</small> {roomState.room.host.name}
            </div>
            {roomState.room.startTime && (
              <div className="me-4 mb-1">
                <small className="text-muted">Started:</small> {new Date(roomState.room.startTime).toLocaleTimeString()}
              </div>
            )}
            {roomState.room.createdAt && !roomState.room.startTime && (
              <div className="me-4 mb-1">
                <small className="text-muted">Created:</small> {new Date(roomState.room.createdAt).toLocaleDateString()}
              </div>
            )}
            <div className="me-4 mb-1">
              <small className="text-muted">Participants:</small> {participants.length}
            </div>
            <div className="me-4 mb-1">
              <small className="text-muted">Focus:</small> {roomState.room.tags.join(', ')}
            </div>
          </div>
        </div>
      )}
      
      <Row className="g-0 h-100">
        <Col lg={9} className="room-main">
          <Tab.Container 
            id="room-tabs" 
            activeKey={activeTab} 
            onSelect={(k) => k && setActiveTab(k)}
          >
            <div className="room-tabs-header p-2 border-bottom">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="study" title="Study tab" aria-label="Study tab">
                    <i className="bi bi-book me-2"></i>
                    Study
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tasks" title="Tasks tab" aria-label="Tasks tab">
                    <i className="bi bi-check2-square me-2"></i>
                    Tasks
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="resources" title="Resources tab" aria-label="Resources tab">
                    <i className="bi bi-file-earmark me-2"></i>
                    Resources
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="notes" title="Notes tab" aria-label="Notes tab">
                    <i className="bi bi-pencil me-2"></i>
                    Notes
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            
            <Tab.Content className="h-100">
              <Tab.Pane eventKey="study" className="h-100">
                <div className="study-container p-3">
                  <div className="study-header mb-4">
                    <h4>Current Topic: {roomState.room?.title}</h4>
                    <div className="study-progress">
                      <div className="progress-info">
                        <span>Study Progress</span>
                        <span>{Math.floor((elapsedTime / 3600) * 100)}%</span>
                      </div>
                      <ProgressBar 
                        now={Math.min(100, (elapsedTime / 3600) * 100)} 
                        variant="success" 
                        className="study-progress-bar"
                      />
                    </div>
                  </div>

                  <div className="study-content">
                    <div className="study-section">
                      <h5>Key Concepts</h5>
                      <div className="concepts-grid">
                        {roomState.room?.tags.map((tag: string, index: number) => (
                          <div key={index} className="concept-card">
                            <i className="bi bi-lightbulb"></i>
                            <h6>{tag}</h6>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="study-section">
                      <h5>Practice Problems</h5>
                      <div className="problems-list">
                        {tasks.map(task => (
                          <div key={task.id} className="problem-card">
                            <div className="problem-header">
                              <h6>{task.title}</h6>
                              <Badge bg={task.status === 'Completed' ? 'success' : 'warning'}>
                                {task.status}
                              </Badge>
                            </div>
                            <p className="problem-description">{task.description}</p>
                            <div className="problem-actions">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleChangeTaskStatus(task.id, task.status === 'To Do' ? 'In Progress' : 'Completed')}
                              >
                                {task.status === 'To Do' ? 'Start Solving' : 
                                 task.status === 'In Progress' ? 'Mark Completed' : 'Restart'}
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={() => {
                                  // In a real app, this would open a solution view
                                  alert(`Solution for "${task.title}" would be displayed here.`);
                                }}
                              >
                                View Solution
                </Button>
                            </div>
                          </div>
                        ))}
              </div>
            </div>
            
                    <div className="study-section">
                      <h5>Study Materials</h5>
                      <div className="materials-grid">
                        {resources.map(resource => (
                          <div key={resource.id} className="material-card">
                            <div className="material-icon">
                              <i className={`bi ${
                                resource.type === 'document' ? 'bi-file-text' :
                                resource.type === 'pdf' ? 'bi-file-pdf' :
                                'bi-link-45deg'
                              }`}></i>
                            </div>
                            <div className="material-info">
                              <h6>{resource.title}</h6>
                              <small className="text-muted">
                                Added by {resource.uploadedBy.name}
                              </small>
                            </div>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="tasks" className="p-3">
                {renderTasksSection()}
              </Tab.Pane>
              
              <Tab.Pane eventKey="resources" className="p-3">
                {renderResourcesSection()}
              </Tab.Pane>
              
              <Tab.Pane eventKey="notes" className="p-3">
                {renderNotesSection()}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
        
        <Col lg={3} className="room-sidebar">
          <div className="participants-container">
            <div className="participants-header p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Study Partners ({participants.length})</h5>
              <Button variant="link" className="p-0">
                <i className="bi bi-three-dots-vertical"></i>
              </Button>
            </div>
            <div className="participants-list p-2">
              {participants.map(participant => (
                <div key={participant.id} className="participant-item p-2">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-2">
                    <Image 
                      src={participant.avatar} 
                      alt={participant.name}
                        width={40}
                        height={40}
                      roundedCircle
                        className={participant.isYou ? 'border border-primary' : ''}
                      />
                      <div className={`status-indicator status-${participant.status}`}></div>
                      <div className="participant-level" title={`Level ${participant.level}`}>
                        {participant.level}
                      </div>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                      <span className="participant-name">
                        {participant.name} 
                          {participant.isYou && <span className="text-muted ms-1">(You)</span>}
                      </span>
                        {participant.isHost && (
                          <Badge bg="primary" className="ms-1 host-badge">Host</Badge>
                        )}
                    </div>
                      <small className="text-muted d-block">
                        {participant.status === 'active' ? 'Studying' : 
                         participant.status === 'busy' ? 'Solving Problems' : 'Away'}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sidebar-section border-top mt-3 pt-3">
            <div className="px-3 pb-2">
              <h6>Study Session Details</h6>
              {roomState.room && (
                <>
                  <p className="small text-muted mb-2">{roomState.room.description}</p>
                  <div className="mb-2">
                    <span className="small text-muted">Topic: </span>
                    <Badge bg="info">{roomState.room.title}</Badge>
                      </div>
                  <div className="mb-2">
                    <span className="small text-muted">Participants: </span>
                    <span className="small">{participants.length}/{roomState.room.participants?.length || 0}</span>
                    </div>
                  <div className="mb-3">
                    {roomState.room.tags.map((tag: string, index: number) => (
                      <Badge key={index} bg="light" text="dark" className="me-1 mb-1">{tag}</Badge>
                    ))}
                  </div>
                </>
              )}
                </div>
          </div>
          
          <div className="sidebar-section border-top mt-3 pt-3">
            <div className="px-3 pb-3">
              <h6>Your Progress</h6>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small>Study XP</small>
                  <small className="text-success">+{Math.floor(elapsedTime / 60)} XP</small>
                </div>
                <ProgressBar 
                  now={Math.min(100, (elapsedTime / 3600) * 100)} 
                  variant="success" 
                  className="xp-progress"
                />
              </div>
              <div className="d-flex justify-content-between small text-muted mb-3">
                <span>1 hour = 60 XP</span>
                <span>{Math.floor(elapsedTime / 60)}/60 XP</span>
              </div>
              <Button variant="outline-primary" size="sm" className="w-100">
                <i className="bi bi-trophy me-2"></i>
                View Achievements
                  </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Room; 