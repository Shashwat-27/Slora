import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoomService from '../services/RoomService';
import GamificationService from '../services/GamificationService';
import '../styles/CreateRoom.css';

// Room categories
const roomCategories = [
  'Education',
  'Technology',
  'Career',
  'Wellness',
  'Creativity',
  'Social',
  'Entertainment',
  'Business',
  'Other'
];

interface FormData {
  roomName: string;
  description: string;
  category: string;
  maxParticipants: string;
  isPublic: boolean;
  tags: string[];
}

interface FormErrors {
  roomName?: string;
  description?: string;
  category?: string;
  tags?: string;
}

// Interface for storing room data
interface RoomData {
  id: number;
  name: string;
  image: string;
  category: string;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  tags: string[];
  host: {
    name: string;
    level: number;
    avatar: string;
  };
  description: string;
  createdAt: string;
  isPublic: boolean;
}

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userStats } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    roomName: '',
    description: '',
    category: '',
    maxParticipants: '10',
    isPublic: true,
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'isPublic') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is modified
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
      
      // Clear tags error if it exists
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: undefined }));
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    if (!formData.roomName.trim()) {
      newErrors.roomName = 'Room name is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Please add at least one tag';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random image based on category
      const image = `https://source.unsplash.com/random/800x600/?${formData.category.toLowerCase()},study`;
      
      // Create room data for Firebase
      const roomData = {
        name: formData.roomName,
        description: formData.description,
        category: formData.category,
        maxParticipants: parseInt(formData.maxParticipants),
        isLive: true,
        tags: formData.tags,
        image: image,
        host: {
          id: currentUser.uid,
          name: currentUser.displayName || 'Anonymous',
          level: userStats?.level || 1,
          avatar: currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
        },
        participants: 0,
        isPublic: formData.isPublic
      };
      
      // Create room in Firebase using RoomService
      const newRoom = await RoomService.createRoom(roomData);
      
      // Track room creation in gamification system
      await GamificationService.recordRoomCreated(currentUser.uid);
      
      // Join the room as host
      await RoomService.joinRoom(
        newRoom.id.toString(), 
        currentUser.uid, 
        {
          name: currentUser.displayName || 'Anonymous',
          avatar: currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
          level: userStats?.level || 1
        }
      );
      
      // Store a copy in localStorage for offline access
      const localRooms = JSON.parse(localStorage.getItem('myRooms') || '[]');
      localStorage.setItem('myRooms', JSON.stringify([
        {
          ...newRoom,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...localRooms
      ]));
      
      // Navigate to the new room
      navigate(`/room/${newRoom.id}`, {
        state: {
          room: newRoom,
          joinMode: "video",
          settings: {
            videoEnabled: true,
            audioEnabled: true,
            chatEnabled: true,
            notificationsEnabled: true,
            recordingEnabled: false
          },
          newRoomCreated: true
        }
      });
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h3 className="mb-0">Create New Room</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label htmlFor="room-name">Room Name</Form.Label>
                  <Form.Control
                    id="room-name"
                    name="roomName"
                    value={formData.roomName}
                    onChange={handleChange}
                    isInvalid={!!errors.roomName}
                    placeholder="Enter a name for your room"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.roomName}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label htmlFor="room-description">Description</Form.Label>
                  <Form.Control
                    id="room-description"
                    name="description"
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    placeholder="Describe the purpose of your room"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-4">
                      <Form.Label htmlFor="category-select">Category</Form.Label>
                      <Form.Select
                        id="category-select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        isInvalid={!!errors.category}
                        title="Room category"
                        aria-label="Room category"
                      >
                        <option value="">Select category</option>
                        {roomCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={7}>
                    <Form.Group className="mb-4">
                      <Form.Label htmlFor="max-participants-select">Maximum Participants</Form.Label>
                      <Form.Select
                        id="max-participants-select"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        title="Maximum number of participants"
                        aria-label="Maximum number of participants"
                      >
                        <option value="5">5 people</option>
                        <option value="10">10 people</option>
                        <option value="20">20 people</option>
                        <option value="50">50 people</option>
                        <option value="100">100 people</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label htmlFor="tags-input">Tags</Form.Label>
                  <div className={`tags-input-container ${errors.tags ? 'is-invalid' : ''}`}>
                    <div className="tags-list">
                      {formData.tags.map(tag => (
                        <div key={tag} className="tag-item">
                          <span>{tag}</span>
                          <Button variant="link" className="tag-remove" onClick={() => removeTag(tag)}>
                            &times;
                          </Button>
                        </div>
                      ))}
                      <Form.Control
                        id="tags-input"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Add tags (press Enter)"
                        className="tags-input"
                      />
                    </div>
                  </div>
                  {errors.tags && (
                    <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                      {errors.tags}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Add tags to help others find your room (e.g., "math", "study group", "beginners")
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="public-switch"
                    name="isPublic"
                    label="Make room public"
                    checked={formData.isPublic}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Public rooms can be discovered by other users. Private rooms are accessible by invitation only.
                  </Form.Text>
                </Form.Group>
                
                <div className="d-flex justify-content-end gap-3 mt-4">
                  <Button variant="outline-secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Room...' : 'Create Room'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateRoom; 