import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Approved':
        return {
          color: 'var(--status-approved)',
          backgroundColor: 'var(--status-approved-bg)',
          border: '1px solid rgba(22, 163, 74, 0.15)'
        };
      case 'Rejected':
        return {
          color: 'var(--status-rejected)',
          backgroundColor: 'var(--status-rejected-bg)',
          border: '1px solid rgba(220, 38, 38, 0.15)'
        };
      default:
        return {
          color: 'var(--status-pending)',
          backgroundColor: 'var(--status-pending-bg)',
          border: '1px solid rgba(217, 119, 6, 0.15)'
        };
    }
  };

  return (
    <span style={{ ...badgeStyle, ...getStyle() }}>
      {status || 'Pending'}
    </span>
  );
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '600'
};

export default StatusBadge;
