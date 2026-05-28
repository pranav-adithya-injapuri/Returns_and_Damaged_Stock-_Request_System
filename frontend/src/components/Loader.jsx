import React from 'react';

const Loader = ({ size = 'medium', message = 'Loading...' }) => {
  const spinnerSize = size === 'small' ? '24px' : size === 'large' ? '64px' : '40px';
  
  return (
    <div style={containerStyle}>
      <div style={{ ...spinnerStyle, width: spinnerSize, height: spinnerSize }} />
      {message && <p style={textStyle}>{message}</p>}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  width: '100%',
  animation: 'fadeIn 0.3s ease'
};

const spinnerStyle = {
  border: '3px solid rgba(124, 77, 255, 0.1)',
  borderTop: '3px solid var(--accent-secondary)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const textStyle = {
  marginTop: '12px',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  fontWeight: 500
};

// Inject keyframe animation dynamically
const styleSheet = document.styleSheets[0] || (() => {
  const style = document.createElement('style');
  document.head.appendChild(style);
  return style.sheet;
})();
try {
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
} catch (e) {
  // Silent catch if rule already exists or unsupported env
}

export default Loader;
