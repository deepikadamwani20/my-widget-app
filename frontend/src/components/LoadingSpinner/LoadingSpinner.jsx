import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Generating your chatbot...</p>
    </div>
  );
};

export default LoadingSpinner;