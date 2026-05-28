import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search by medicine name...' }) => {
  return (
    <div style={containerStyle}>
      <Search size={18} style={iconStyle} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
};

const containerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px'
};

const iconStyle = {
  position: 'absolute',
  left: '16px',
  color: 'var(--text-muted)'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px 12px 44px',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  fontFamily: 'var(--font-family)',
  outline: 'none'
};

// Add input style focus hook
const style = document.createElement('style');
style.innerHTML = `
  input:focus {
    border-color: var(--accent-secondary) !important;
    box-shadow: 0 0 0 3px var(--border-focus) !important;
  }
`;
document.head.appendChild(style);

export default SearchBar;
