import React from 'react';
import '../styles/components.css';

const Button = ({ type = 'button', onClick, children, disabled = false, className = '' }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`button ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;