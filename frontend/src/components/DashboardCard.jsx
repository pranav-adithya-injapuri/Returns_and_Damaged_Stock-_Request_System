import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color = 'var(--accent-primary)' }) => {
  return (
    <div className="glass-card" style={cardStyle}>
      <div style={contentStyle}>
        <span style={titleStyle}>{title}</span>
        <span style={valueStyle}>{value}</span>
        {subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </div>
      <div style={{ ...iconContainerStyle, backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
        {Icon && <Icon size={24} style={{ color }} />}
      </div>
    </div>
  );
};

const cardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px',
  flex: '1 1 200px',
  minWidth: '220px',
  borderRadius: '12px',
  backgroundColor: 'var(--bg-secondary)',
  boxShadow: 'var(--shadow-sm)'
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const titleStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  fontWeight: '600'
};

const valueStyle = {
  fontSize: '2.2rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  lineHeight: '1.2'
};

const subtitleStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '500',
  marginTop: '2px'
};

const iconContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '52px',
  height: '52px',
  borderRadius: '50%'
};

export default DashboardCard;
