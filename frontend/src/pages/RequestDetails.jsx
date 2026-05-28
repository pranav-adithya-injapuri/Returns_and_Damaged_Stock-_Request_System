import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Calendar, 
  FileText, 
  Hash, 
  Sparkles, 
  User, 
  Package, 
  AlertTriangle 
} from 'lucide-react';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

const RequestDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState({ show: false, text: '', type: '' });

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await axios.get(`http://localhost:5000/api/request/${id}`);
      if (response.data.success) {
        setRequest(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to pull request details from live server. Displaying simulated offline details instead.');
      // Offline fallback dummy request details
      setRequest({
        id: parseInt(id),
        pharmacy_name: 'City Health Rx',
        medicine_name: 'Amoxicillin 500mg',
        batch_number: 'AMO-7762',
        expiry_date: '2027-02-15',
        quantity: 80,
        reason: 'Damaged Packaging',
        status: 'Pending',
        created_at: '2026-05-28 12:45:10',
        image_path: null,
        ai_analysis: `1. DAMAGE VISIBILITY: Outer seal remains intact, but substantial cardboard crushing is visible at the left side of the pack.\n2. PACKAGING CONDITION: Torn carton corners are evident; foil backing is sealed but shows minor folding stress.\n3. EXPIRY VISIBILITY: Expiry date label on the side is clear and confirms 'EXP: 02/2027'.\n4. LABEL READABILITY: Product identity 'Amoxicillin 500mg' is 100% legible and clear.\n5. MOISTURE/LEAKAGE SIGNS: Blisters show no signs of active degradation or dampness.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      const response = await axios.put('http://localhost:5000/api/update-status', {
        id: parseInt(id),
        status: newStatus,
        admin_username: user?.username || 'Admin'
      });

      if (response.data.success) {
        setRequest(prev => ({ ...prev, status: newStatus }));
        showToast(`Request ${newStatus.toLowerCase()} successfully!`, 'success');
      }
    } catch (err) {
      console.error(err);
      // Offline fallback change state
      setRequest(prev => ({ ...prev, status: newStatus }));
      showToast(`[Offline fallback] Updated status to ${newStatus}`, 'success');
    } finally {
      setActionLoading(false);
    }
  };

  const showToast = (text, type) => {
    setToastMsg({ show: true, text, type });
    setTimeout(() => {
      setToastMsg({ show: false, text: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  if (loading) {
    return <Loader message="Decrypting request detail values..." />;
  }

  if (!request) {
    return (
      <div style={notFoundStyle}>
        <AlertTriangle size={48} color="var(--status-rejected)" />
        <h2>Request Not Found</h2>
        <p>The requested return request ID does not exist in the registry.</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>
    );
  }

  // Construct image URL
  const imageUrl = request.image_path 
    ? `http://localhost:5000/${request.image_path}` 
    : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'; // fallback placeholder

  return (
    <div style={containerStyle} className="fade-in">
      {/* Toast Notification */}
      {toastMsg.show && (
        <div className={`toast ${toastMsg.type}`}>
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Back button and page title */}
      <div style={topBarStyle}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          <ArrowLeft size={18} />
          <span>Back to List</span>
        </button>
        <div style={titleContainerStyle}>
          <span style={requestIdText}>Request ID: #{request.id}</span>
          <StatusBadge status={request.status} />
        </div>
      </div>

      {errorMsg && (
        <div style={warningStyle}>
          <span>{errorMsg}</span>
        </div>
      )}

      <div style={layoutGridStyle}>
        {/* Left column: Information Details Card & Action Buttons */}
        <div style={leftColStyle}>
          <div className="glass-card" style={detailCardStyle}>
            <h3 style={sectionTitleStyle}>Medicine Details</h3>
            
            <div style={detailListStyle}>
              <div style={detailItemStyle}>
                <div style={iconBoxStyle}>
                  <Package size={16} color="var(--accent-primary)" />
                </div>
                <div style={itemInfoStyle}>
                  <span style={itemLabelStyle}>Medicine Name</span>
                  <span style={itemValueStyle}>{request.medicine_name}</span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={iconBoxStyle}>
                  <Hash size={16} color="var(--accent-primary)" />
                </div>
                <div style={itemInfoStyle}>
                  <span style={itemLabelStyle}>Batch Number</span>
                  <code style={codeStyle}>{request.batch_number}</code>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={iconBoxStyle}>
                  <Calendar size={16} color="var(--accent-primary)" />
                </div>
                <div style={itemInfoStyle}>
                  <span style={itemLabelStyle}>Expiry Date</span>
                  <span style={itemValueStyle}>{request.expiry_date}</span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={iconBoxStyle}>
                  <FileText size={16} color="var(--accent-primary)" />
                </div>
                <div style={itemInfoStyle}>
                  <span style={itemLabelStyle}>Quantity (Units)</span>
                  <span style={itemValueStyle}>{request.quantity}</span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={iconBoxStyle}>
                  <User size={16} color="var(--accent-primary)" />
                </div>
                <div style={itemInfoStyle}>
                  <span style={itemLabelStyle}>Submitted By Pharmacy</span>
                  <span style={itemValueStyle}>{request.pharmacy_name}</span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={iconBoxStyle}>
                  <FileText size={16} color="var(--accent-primary)" />
                </div>
                <div style={itemInfoStyle}>
                  <span style={itemLabelStyle}>Reason for Return</span>
                  <span style={itemValueStyle}>{request.reason}</span>
                </div>
              </div>
            </div>

            {/* Admin action triggers */}
            {user?.role === 'admin' && request.status === 'Pending' && (
              <div style={actionsRowStyle}>
                <button
                  onClick={() => handleUpdateStatus('Approved')}
                  className="btn btn-success"
                  style={actionBtnStyle}
                  disabled={actionLoading}
                >
                  <Check size={18} />
                  <span>Approve Request</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Rejected')}
                  className="btn btn-danger"
                  style={actionBtnStyle}
                  disabled={actionLoading}
                >
                  <X size={18} />
                  <span>Reject Request</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Analysis Card */}
          <div className="glass-card" style={aiCardStyle}>
            <div style={aiTitleGroup}>
              <Sparkles size={20} color="var(--accent-secondary)" />
              <h3 style={aiTitleStyle}>Gemini AI Image Analysis</h3>
            </div>
            <div style={aiBodyStyle}>
              {request.ai_analysis ? (
                request.ai_analysis.split('\n').map((line, idx) => (
                  <p key={idx} style={aiLineStyle}>
                    {line}
                  </p>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No AI Analysis result is available for this request.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Image Uploader Viewer */}
        <div style={rightColStyle}>
          <div className="glass-card" style={imageCardStyle}>
            <h3 style={{ ...sectionTitleStyle, marginBottom: '16px' }}>Uploaded Medicine Image</h3>
            <div style={imageWrapperStyle}>
              <img src={imageUrl} alt={request.medicine_name} style={imgStyle} />
            </div>
            {!request.image_path && (
              <p style={imageDisclaimerStyle}>
                Showing standard pharmaceutical placeholder image since request lacks original upload file path.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const topBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '16px'
};

const backButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  transition: 'all 0.2s',
  ':hover': {
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)'
  }
};

const titleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const requestIdText = {
  fontSize: '1.2rem',
  fontWeight: '800',
  color: 'var(--text-primary)'
};

const warningStyle = {
  backgroundColor: 'rgba(255, 215, 0, 0.08)',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  color: 'var(--status-pending)',
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const layoutGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '24px',
  alignItems: 'start',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr'
  }
};

const leftColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const detailCardStyle = {
  padding: '32px',
  borderRadius: '16px'
};

const sectionTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  marginBottom: '24px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '12px'
};

const detailListStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px 16px',
  marginBottom: '32px',
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr'
  }
};

const detailItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const iconBoxStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  backgroundColor: '#eef2ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const itemInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const itemLabelStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  fontWeight: '600',
  letterSpacing: '0.05em'
};

const itemValueStyle = {
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
  fontWeight: '700'
};

const codeStyle = {
  backgroundColor: 'var(--bg-tertiary)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  fontWeight: '700',
  border: '1px solid var(--border-color)',
  alignSelf: 'flex-start',
  color: 'var(--accent-primary)'
};

const actionsRowStyle = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  paddingTop: '20px',
  borderTop: '1px solid var(--border-color)'
};

const actionBtnStyle = {
  flex: '1'
};

const aiCardStyle = {
  padding: '28px',
  borderRadius: '16px',
  borderLeft: '4px solid var(--accent-primary)'
};

const aiTitleGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '12px'
};

const aiTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const aiBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const aiLineStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.6'
};

const rightColStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const imageCardStyle = {
  padding: '24px',
  borderRadius: '16px'
};

const imageWrapperStyle = {
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-secondary)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '320px',
  maxHeight: '480px'
};

const imgStyle = {
  maxWidth: '100%',
  maxHeight: '480px',
  objectFit: 'contain'
};

const imageDisclaimerStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontStyle: 'italic',
  marginTop: '12px',
  textAlign: 'center'
};

const notFoundStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 32px',
  textAlign: 'center',
  gap: '12px'
};

export default RequestDetails;
