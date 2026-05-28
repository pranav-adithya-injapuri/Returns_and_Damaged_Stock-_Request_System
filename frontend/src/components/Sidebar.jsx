import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  ShieldAlert, 
  LogOut, 
  Plus
} from 'lucide-react';

const Sidebar = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <aside style={sidebarStyle}>
      {/* Brand logo & title */}
      <div style={brandStyle}>
        <div style={logoWrapperStyle}>
          <Plus size={20} strokeWidth={3} />
        </div>
        <div style={brandTextContainer}>
          <span style={brandNameStyle}>MediReturn</span>
          <span style={brandSubStyle}>Returns Management System</span>
        </div>
      </div>

      {/* Nav List */}
      <nav style={navStyle}>
        {user ? (
          <>
            <NavLink 
              to="/dashboard" 
              style={({ isActive }) => ({
                ...navItemStyle,
                ...(isActive ? activeNavItemStyle : {})
              })}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            {user.role === 'pharmacy' && (
              <>
                <NavLink 
                  to="/create-request" 
                  style={({ isActive }) => ({
                    ...navItemStyle,
                    ...(isActive ? activeNavItemStyle : {})
                  })}
                >
                  <PlusCircle size={18} />
                  <span>Add Return Request</span>
                </NavLink>

                <NavLink 
                  to="/history" 
                  style={({ isActive }) => ({
                    ...navItemStyle,
                    ...(isActive ? activeNavItemStyle : {})
                  })}
                >
                  <History size={18} />
                  <span>Return Requests</span>
                </NavLink>
              </>
            )}

            {user.role === 'admin' && (
              <NavLink 
                to="/admin" 
                style={({ isActive }) => ({
                  ...navItemStyle,
                  ...(isActive ? activeNavItemStyle : {})
                })}
              >
                <ShieldAlert size={18} />
                <span>Admin Panel</span>
              </NavLink>
            )}
          </>
        ) : null}
      </nav>

      {/* Logout at bottom */}
      {user && (
        <div style={logoutContainerStyle}>
          <button onClick={handleLogoutClick} style={logoutButtonStyle}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

const sidebarStyle = {
  width: '260px',
  height: '100vh',
  backgroundColor: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100,
  padding: '24px 16px'
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  paddingBottom: '20px',
  marginBottom: '20px'
};

const logoWrapperStyle = {
  backgroundColor: 'var(--accent-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  color: '#ffffff'
};

const brandTextContainer = {
  display: 'flex',
  flexDirection: 'column'
};

const brandNameStyle = {
  fontSize: '1.05rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em',
  lineHeight: '1.2'
};

const brandSubStyle = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  fontWeight: '600',
  marginTop: '2px'
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  flex: '1'
};

const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: '8px',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '0.85rem',
  transition: 'all 0.2s ease'
};

const activeNavItemStyle = {
  backgroundColor: '#eef2ff',
  color: 'var(--accent-primary)'
};

// Add hover styling rules to style element
const hoverStyle = document.createElement('style');
hoverStyle.innerHTML = `
  aside nav a:hover {
    color: var(--accent-primary) !important;
    background-color: #f8fafc;
  }
`;
document.head.appendChild(hoverStyle);

const logoutContainerStyle = {
  marginTop: 'auto',
  paddingTop: '20px'
};

const logoutButtonStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.85rem',
  transition: 'all 0.2s',
  textAlign: 'left'
};

// Add hover style for logout button
const logoutHoverStyle = document.createElement('style');
logoutHoverStyle.innerHTML = `
  aside button:hover {
    color: var(--status-rejected) !important;
    background-color: var(--status-rejected-bg) !important;
  }
`;
document.head.appendChild(logoutHoverStyle);

export default Sidebar;
