import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle} className="fade-in">
      <div className="glass-card" style={cardStyle}>
        <AlertCircle size={64} style={iconStyle} />
        <h1 style={titleStyle}>404 - Page Not Found</h1>
        <p style={subtitleStyle}>
          The page you are looking for does not exist or has been moved.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={buttonStyle}>
          <Home size={18} />
          <span>Go to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  width: '100%',
  padding: '24px'
};

const cardStyle = {
  padding: '48px 32px',
  borderRadius: '20px',
  maxWidth: '480px',
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px'
};

const iconStyle = {
  color: 'var(--status-rejected)'
};

const titleStyle = {
  fontSize: '1.6rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em'
};

const subtitleStyle = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5'
};

const buttonStyle = {
  marginTop: '8px'
};

export default NotFound;
