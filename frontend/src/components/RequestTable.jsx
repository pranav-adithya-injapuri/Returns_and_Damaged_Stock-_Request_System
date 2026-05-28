import React from 'react';
import { Eye, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const RequestTable = ({ requests }) => {
  const navigate = useNavigate();

  if (!requests || requests.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <Tag size={40} style={emptyIconStyle} />
        <h4 style={emptyTitleStyle}>No requests found</h4>
        <p style={emptySubstyle}>Create a new request or adjust your search filter</p>
      </div>
    );
  }

  return (
    <div style={tableContainerStyle} className="glass-card">
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={thStyle}>Pharmacy</th>
            <th style={thStyle}>Medicine Name</th>
            <th style={thStyle}>Batch Number</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Expiry Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} style={rowStyle} className="table-row">
              <td style={tdStyle}>
                <span style={pharmacyNameText}>{req.pharmacy_name}</span>
              </td>
              <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--text-primary)' }}>
                {req.medicine_name}
              </td>
              <td style={tdStyle}>
                <code style={codeStyle}>{req.batch_number}</code>
              </td>
              <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--text-primary)' }}>
                {req.quantity}
              </td>
              <td style={tdStyle}>
                <span style={expiryStyle}>
                  <Calendar size={14} style={calendarIconStyle} />
                  {req.expiry_date}
                </span>
              </td>
              <td style={tdStyle}>
                <StatusBadge status={req.status} />
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => navigate(`/request/${req.id}`)}
                  style={viewButtonStyle}
                  title="View request details"
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableContainerStyle = {
  width: '100%',
  overflowX: 'auto',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-secondary)'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const headerRowStyle = {
  borderBottom: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-tertiary)'
};

const thStyle = {
  padding: '12px 20px',
  color: 'var(--text-secondary)',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const rowStyle = {
  borderBottom: '1px solid var(--border-color)',
  transition: 'background-color 0.2s ease'
};

const tdStyle = {
  padding: '14px 20px',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem'
};

const pharmacyNameText = {
  fontWeight: '500',
  color: 'var(--text-primary)'
};

const codeStyle = {
  backgroundColor: 'var(--bg-tertiary)',
  padding: '4px 8px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)'
};

const expiryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const calendarIconStyle = {
  color: 'var(--text-muted)'
};

const viewButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  backgroundColor: '#ffffff',
  color: 'var(--accent-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

// Insert row hover dynamics
const rowHoverStyle = document.createElement('style');
rowHoverStyle.innerHTML = `
  .table-row:hover {
    background-color: #f8fafc;
  }
  .table-row button:hover {
    background-color: var(--bg-tertiary) !important;
    border-color: #cbd5e1 !important;
  }
`;
document.head.appendChild(rowHoverStyle);

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 32px',
  backgroundColor: 'var(--bg-secondary)',
  border: '2px dashed var(--border-color)',
  borderRadius: '12px',
  textAlign: 'center'
};

const emptyIconStyle = {
  color: 'var(--text-muted)',
  marginBottom: '16px'
};

const emptyTitleStyle = {
  fontSize: '1.1rem',
  color: 'var(--text-primary)',
  fontWeight: '700',
  marginBottom: '4px'
};

const emptySubstyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)'
};

export default RequestTable;
