import React from 'react';
import '../styles/components.css';

const Input = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  className = '',
  label
}) => {
  return (
    <div className="input-container">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input ${className}`}
      />
    </div>
  );
};

export default Input;