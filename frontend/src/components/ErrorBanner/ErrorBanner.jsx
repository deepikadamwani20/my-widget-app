import React from 'react';
import './ErrorBanner.css';

const ErrorBanner = ({ message, onClose }) => {
  return (
    <div className="error-banner">
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">
        ×
      </button>
    </div>
  );
};

export default ErrorBanner;