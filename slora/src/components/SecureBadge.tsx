import React from 'react';
import { Badge } from 'react-bootstrap';

interface SecureBadgeProps {
  type?: 'payment' | 'login' | 'data';
  size?: 'sm' | 'md';
}

const SecureBadge: React.FC<SecureBadgeProps> = ({ 
  type = 'data',
  size = 'sm'
}) => {
  const getIcon = () => {
    switch(type) {
      case 'payment':
        return 'bi-credit-card-lock';
      case 'login':
        return 'bi-shield-lock';
      case 'data':
      default:
        return 'bi-lock';
    }
  };
  
  const getLabel = () => {
    switch(type) {
      case 'payment':
        return 'Secure Payment';
      case 'login':
        return 'Secure Login';
      case 'data':
      default:
        return 'Secure';
    }
  };
  
  return (
    <Badge 
      bg="light" 
      text="dark" 
      className={`d-inline-flex align-items-center ${size === 'sm' ? 'py-1 px-2' : 'py-2 px-3'}`}
    >
      <i className={`bi ${getIcon()} me-1`}></i>
      <span className={size === 'sm' ? 'small' : ''}>{getLabel()}</span>
    </Badge>
  );
};

export default SecureBadge; 