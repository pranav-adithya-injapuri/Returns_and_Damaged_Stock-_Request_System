import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div className="glass-card" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(5, 5, 12, 0.8)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1100,
  animation: 'fadeIn 0.25s ease'
};

const modalStyle = {
  width: '90%',
  maxWidth: '650px',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 24px',
  borderBottom: '1px solid var(--border-color)',
  backgroundColor: 'rgba(27, 27, 61, 0.3)'
};

const titleStyle = {
  fontSize: '1.2rem',
  color: 'var(--text-primary)',
  fontWeight: '700'
};

const closeButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'all 0.2s',
  ':hover': {
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-tertiary)'
  }
};

const bodyStyle = {
  padding: '24px',
  overflowY: 'auto',
  flex: '1'
};

export default Modal;
