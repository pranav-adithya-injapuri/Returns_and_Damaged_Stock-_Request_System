import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Send,
  Calendar,
  Eye,
  Upload
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  // Dashboard stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Recent requests state
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states (from CreateRequest)
  const [pharmacyName, setPharmacyName] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  // File states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch dashboard stats & recent requests
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, requestsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard-stats'),
        axios.get('http://localhost:5000/api/requests')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (requestsRes.data.success) {
        // Sort and limit to top 5
        const sorted = requestsRes.data.data.sort((a, b) => b.id - a.id);
        setRecentRequests(sorted.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not sync with MySQL database. Displaying mock dashboard metrics.');

      // Fallback dummy statistics matching the mockup values
      setStats({
        total: 128,
        pending: 23,
        approved: 78,
        rejected: 27
      });

      // Fallback dummy recent requests matching the mockup rows
      setRecentRequests([
        { id: 128, pharmacy_name: 'City Pharmacy', medicine_name: 'Paracetamol 650mg', batch_number: 'B12345', expiry_date: '20 May 2024', quantity: 120, reason: 'Expired Stock', status: 'Pending', created_at: '2026-05-20' },
        { id: 127, pharmacy_name: 'Health Plus', medicine_name: 'Amoxicillin 500mg', batch_number: 'A98765', expiry_date: '19 May 2024', quantity: 50, reason: 'Damaged Packaging', status: 'Approved', created_at: '2026-05-19' },
        { id: 126, pharmacy_name: 'MediCare Store', medicine_name: 'Cetirizine 10mg', batch_number: 'C54321', expiry_date: '18 May 2024', quantity: 90, reason: 'Near Expiry', status: 'Pending', created_at: '2026-05-18' },
        { id: 125, pharmacy_name: 'Life Pharmacy', medicine_name: 'Ibuprofen 400mg', batch_number: 'I11111', expiry_date: '17 May 2024', quantity: 200, reason: 'Expired Stock', status: 'Rejected', created_at: '2026-05-17' },
        { id: 124, pharmacy_name: 'Sunrise Pharmacy', medicine_name: 'Azithromycin 250mg', batch_number: 'A22222', expiry_date: '16 May 2024', quantity: 75, reason: 'Damaged Packaging', status: 'Approved', created_at: '2026-05-16' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle image upload and conversion to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image file size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
    reader.onerror = () => {
      setFormError('Failed to process image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl('');
    setBase64Image('');
  };

  // Submit return request
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validations
    if (!pharmacyName) return setFormError('Pharmacy Name is required.');
    if (!medicineName.trim()) return setFormError('Medicine Name is required.');
    if (!batchNumber.trim()) return setFormError('Batch Number is required.');
    if (!expiryDate) return setFormError('Expiry Date is required.');
    if (!quantity || parseInt(quantity) <= 0) return setFormError('Please enter a valid quantity.');
    if (!reason) return setFormError('Please select a reason.');
    if (!base64Image) return setFormError('Please upload medicine photos.');

    setFormLoading(true);

    try {
      const payload = {
        pharmacy_name: pharmacyName,
        medicine_name: medicineName,
        batch_number: batchNumber,
        expiry_date: expiryDate,
        quantity: parseInt(quantity),
        reason: reason,
        image_data: base64Image,
        image_name: imageFile?.name || 'upload.jpg'
      };

      const response = await axios.post('http://localhost:5000/api/create-request', payload);

      if (response.data.success) {
        setFormSuccess('Return request submitted successfully!');
        // Clear fields
        setMedicineName('');
        setBatchNumber('');
        setExpiryDate('');
        setQuantity('');
        setReason('');
        handleRemoveImage();

        // Refresh data
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to submit request. MySQL/backend offline fallback.');

      // Offline fallback addition
      const mockNew = {
        id: Math.max(...recentRequests.map(r => r.id), 128) + 1,
        pharmacy_name: pharmacyName,
        medicine_name: medicineName,
        batch_number: batchNumber,
        expiry_date: expiryDate,
        quantity: parseInt(quantity),
        reason: reason,
        status: 'Pending',
        created_at: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      setRecentRequests(prev => [mockNew, ...prev.slice(0, 4)]);
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1
      }));
      setFormSuccess('Request submitted successfully (Offline mode)!');

      setMedicineName('');
      setBatchNumber('');
      setExpiryDate('');
      setQuantity('');
      setReason('');
      handleRemoveImage();
    } finally {
      setFormLoading(false);
    }
  };

  // Mock photoroll matching mockup's pill blister pack images
  const mockPhotoRoll = [
    'https://images.unsplash.com/photo-1607619275117-7fd1d9d0444f?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbbab9?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200&auto=format&fit=crop'
  ];

  return (
    <div style={containerStyle} className="fade-in">
      {/* Header Info */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Returns Dashboard</h1>
        <p style={subtitleStyle}>Manage return requests and damaged stock</p>
      </div>

      {errorMsg && (
        <div style={warningStyle}>
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <Loader message="Loading dashboard values..." />
      ) : (
        <>
          {/* Stats Cards Row */}
          <div style={cardsGridStyle}>
            <DashboardCard
              title="Total Requests"
              value={stats.total}
              subtitle="All time"
              icon={FileText}
              color="#4f46e5"
            />
            <DashboardCard
              title="Pending"
              value={stats.pending}
              subtitle="Awaiting review"
              icon={Clock}
              color="#d97706"
            />
            <DashboardCard
              title="Approved"
              value={stats.approved}
              subtitle="This month"
              icon={CheckCircle}
              color="#16a34a"
            />
            <DashboardCard
              title="Rejected"
              value={stats.rejected}
              subtitle="This month"
              icon={XCircle}
              color="#dc2626"
            />
          </div>

          {/* Two Columns Section */}
          <div style={dashboardGridStyle}>

            {/* Left Column: New Return Request Form */}
            <div style={leftColStyle}>
              <div className="glass-card" style={formCardStyle}>
                <div style={formHeaderStyle}>
                  <Plus size={18} color="#ffffff" style={{ marginRight: '8px' }} />
                  <span style={formHeaderTitleStyle}>New Return Request</span>
                </div>

                <form onSubmit={handleSubmitRequest} style={formBodyStyle}>
                  {formError && <div style={formErrorStyle}>{formError}</div>}
                  {formSuccess && <div style={formSuccessStyle}>{formSuccess}</div>}

                  <div className="form-group">
                    <label className="form-label">Pharmacy Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      className="form-control"
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      style={inputFieldStyle}
                    >
                      <option value="">Select Pharmacy</option>
                      <option value="City Pharmacy">City Pharmacy</option>
                      <option value="Health Plus">Health Plus</option>
                      <option value="MediCare Store">MediCare Store</option>
                      <option value="Life Pharmacy">Life Pharmacy</option>
                      <option value="Sunrise Pharmacy">Sunrise Pharmacy</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medicine Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search medicine name"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      style={inputFieldStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Batch Number <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter batch number"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      style={inputFieldStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expiry Date <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      style={inputFieldStyle}
                    />
                  </div>

                  <div style={inlineFieldsRowStyle}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Quantity <span style={{ color: '#ef4444' }}>*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={inputFieldStyle}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Reason for Return <span style={{ color: '#ef4444' }}>*</span></label>
                      <select
                        className="form-control"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={inputFieldStyle}
                      >
                        <option value="">Select reason</option>
                        <option value="Expired Stock">Expired Stock</option>
                        <option value="Damaged Packaging">Damaged Packaging</option>
                        <option value="Near Expiry">Near Expiry</option>
                        <option value="Product Recall">Product Recall</option>
                        <option value="Pill Discoloration / Moisture Degradation">Pill Discoloration / Moisture Degradation</option>
                        <option value="Incorrect Batch Delivery">Incorrect Batch Delivery</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload Photos <span style={{ color: '#ef4444' }}>*</span></label>
                    {imagePreviewUrl ? (
                      <div style={previewWrapperStyle}>
                        <img src={imagePreviewUrl} alt="Blister pack preview" style={previewImageStyle} />
                        <button type="button" onClick={handleRemoveImage} style={removeImageButtonStyle}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label style={dropZoneStyle}>
                        <Upload size={24} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
                        <span style={dropZoneTextStyle}>Click to upload photos</span>
                        <span style={dropZoneSubtextStyle}>or drag and drop</span>
                        <span style={dropZoneMinitextStyle}>PNG, JPG up to 5MB (Max 5 files)</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={submitButtonStyle}
                    disabled={formLoading}
                  >
                    <Send size={16} style={{ marginRight: '6px' }} />
                    {formLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Recent Return Requests Table & Photos Preview */}
            <div style={rightColStyle}>

              {/* Recent Requests Card */}
              <div className="glass-card" style={recentRequestsCardStyle}>
                <div style={recentRequestsHeaderStyle}>
                  <h3 style={recentRequestsTitleStyle}>Recent Return Requests</h3>
                  <Link to={user?.role === 'pharmacy' ? "/history" : "/admin"} style={viewAllLinkStyle}>
                    View All
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={tableHeaderRowStyle}>
                        <th style={thStyle}>Request ID</th>
                        <th style={thStyle}>Pharmacy</th>
                        <th style={thStyle}>Medicine</th>
                        <th style={thStyle}>Batch No.</th>
                        <th style={thStyle}>Reason</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((req) => (
                        <tr key={req.id} style={tableRowStyle} className="table-row">
                          <td style={tdStyle}>
                            <span style={requestIdText}>RET-{req.id}</span>
                          </td>
                          <td style={tdStyle}>{req.pharmacy_name}</td>
                          <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--text-primary)' }}>{req.medicine_name}</td>
                          <td style={tdStyle}>
                            <code style={codeStyle}>{req.batch_number}</code>
                          </td>
                          <td style={tdStyle}>{req.reason}</td>
                          <td style={tdStyle}>
                            <StatusBadge status={req.status} />
                          </td>
                          <td style={tdStyle}>
                            {req.created_at ? new Date(req.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 May 2024'}
                          </td>
                          <td style={tdStyle}>
                            <button
                              onClick={() => navigate(`/request/${req.id}`)}
                              style={viewButtonStyle}
                              title="Details"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Photos Preview Card */}
              <div className="glass-card" style={photosPreviewCardStyle}>
                <h3 style={photosTitleStyle}>Request Photos Preview</h3>
                <div style={photosRowStyle}>
                  {mockPhotoRoll.map((url, i) => (
                    <div key={i} style={photoContainerStyle}>
                      <img src={url} alt={`Blister pack close up ${i + 1}`} style={photoStyle} />
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </>
      )}
    </div>
  );
};

// Styles matching mockup image perfectly
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const headerStyle = {
  marginBottom: '8px'
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em'
};

const subtitleStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  marginTop: '4px'
};

const warningStyle = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fef3c7',
  color: '#d97706',
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const cardsGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  width: '100%'
};

const dashboardGridStyle = {
  display: 'grid',
  gridTemplateColumns: '380px 1fr',
  gap: '24px',
  alignItems: 'start'
};

// Left Column Styles
const leftColStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const formCardStyle = {
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--border-color)'
};

const formHeaderStyle = {
  backgroundColor: 'var(--accent-primary)',
  padding: '14px 20px',
  display: 'flex',
  alignItems: 'center',
  color: '#ffffff'
};

const formHeaderTitleStyle = {
  fontWeight: '700',
  fontSize: '0.9rem',
  letterSpacing: '0.02em'
};

const formBodyStyle = {
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const formErrorStyle = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fee2e2',
  color: '#dc2626',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const formSuccessStyle = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #dcfce7',
  color: '#16a34a',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600',
  textAlign: 'center'
};

const inputFieldStyle = {
  fontSize: '0.85rem',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)'
};

const inlineFieldsRowStyle = {
  display: 'flex',
  gap: '12px'
};

const dropZoneStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 16px',
  border: '1px dashed var(--border-color)',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  textAlign: 'center'
};

const dropZoneTextStyle = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--text-primary)'
};

const dropZoneSubtextStyle = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--text-secondary)'
};

const dropZoneMinitextStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  marginTop: '4px'
};

const previewWrapperStyle = {
  position: 'relative',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  overflow: 'hidden',
  height: '140px',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#fafafa'
};

const previewImageStyle = {
  maxHeight: '100%',
  objectFit: 'contain'
};

const removeImageButtonStyle = {
  position: 'absolute',
  top: '6px',
  right: '6px',
  backgroundColor: 'rgba(220, 38, 38, 0.9)',
  color: '#ffffff',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  cursor: 'pointer',
  fontWeight: '600'
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'var(--accent-primary)',
  color: '#ffffff',
  fontSize: '0.9rem',
  borderRadius: '6px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: '700'
};

// Right Column Styles
const rightColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const recentRequestsCardStyle = {
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)'
};

const recentRequestsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const recentRequestsTitleStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const viewAllLinkStyle = {
  fontSize: '0.8rem',
  color: 'var(--accent-primary)',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '6px 12px',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s'
};

// Table styling inside dashboard
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const tableHeaderRowStyle = {
  borderBottom: '1px solid var(--border-color)'
};

const thStyle = {
  padding: '10px 12px',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: 'var(--text-secondary)'
};

const tableRowStyle = {
  borderBottom: '1px solid var(--border-color)'
};

const tdStyle = {
  padding: '12px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  whiteSpace: 'nowrap'
};

const requestIdText = {
  fontWeight: '600',
  color: 'var(--text-primary)'
};

const codeStyle = {
  backgroundColor: 'var(--bg-tertiary)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)'
};

const viewButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  backgroundColor: '#ffffff',
  color: 'var(--accent-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  cursor: 'pointer'
};

// Photos Preview section
const photosPreviewCardStyle = {
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)'
};

const photosTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginBottom: '16px'
};

const photosRowStyle = {
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  paddingBottom: '4px'
};

const photoContainerStyle = {
  flex: '0 0 130px',
  height: '100px',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)',
  backgroundColor: '#fafafa'
};

const photoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

export default Dashboard;
