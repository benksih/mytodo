import React from 'react';
import './Auth.css';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>{title}</h2>
        </div>
        <div className="auth-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
