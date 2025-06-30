import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Define props for LinkButton, extending ButtonProps
interface LinkButtonProps extends ButtonProps {
  to: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, children, ...props }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(to);
    window.scrollTo(0, 0);
  };
  
  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default LinkButton; 