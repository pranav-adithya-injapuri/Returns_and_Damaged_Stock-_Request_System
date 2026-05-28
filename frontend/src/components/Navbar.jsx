import React from 'react';
import { Bell, Menu } from 'lucide-react';

const Navbar = ({ title, user }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(/[\s_.-]+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'pharmacy') return 'Pharmacy Staff';
    return role || 'Staff';
  };

  return (
    <header style={headerStyle}>
      <button style={menuButtonStyle} aria-label="Toggle Menu">
        <Menu size={20} />
      </button>

      <div style={actionsStyle}>
        <div style={bellContainerStyle} title="Notifications">
          <Bell size={20} style={bellStyle} />
          <span style={badgeStyle}>3</span>
        </div>
        
        {user && (
          <div style={profileStyle}>
            <div style={userInfoStyle}>
              <span style={userNameStyle}>{user.username}</span>
              <span style={userRoleStyle}>{getRoleLabel(user.role)}</span>
            </div>
            <div style={avatarStyle}>
              {getInitials(user.username)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  backgroundColor: 'transparent',
  zIndex: 90
};

const menuButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  transition: 'background-color 0.2s'
};

// Add hover effect for hamburger
const menuHoverStyle = document.createElement('style');
menuHoverStyle.innerHTML = `
  header button:hover {
    background-color: var(--bg-tertiary) !important;
    color: var(--text-primary) !important;
  }
`;
document.head.appendChild(menuHoverStyle);

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  marginLeft: 'auto'
};

const bellContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const bellStyle = {
  color: 'var(--text-secondary)'
};

const badgeStyle = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '0.65rem',
  fontWeight: '700',
  borderRadius: '50%',
  width: '15px',
  height: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #ffffff'
};

const profileStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const userInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'right'
};

const userNameStyle = {
  fontSize: '0.85rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const userRoleStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  fontWeight: '500'
};

const avatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#e0e7ff',
  color: 'var(--accent-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '0.85rem',
  border: '1px solid #c7d2fe'
};

export default Navbar;
