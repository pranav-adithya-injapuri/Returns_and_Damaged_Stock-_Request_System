import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, FileCheck, HelpCircle } from 'lucide-react';
import ImagePreview from '../components/ImagePreview';
import Loader from '../components/Loader';

const CreateRequest = ({ user }) => {
  const navigate = useNavigate();
  const [medicineName, setMedicineName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  
  // File states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [base64Image, setBase64Image] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle image upload and conversion to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));

    // Convert file to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl('');
    setBase64Image('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!medicineName.trim()) return setErrorMsg('Medicine Name is required.');
    if (!batchNumber.trim()) return setErrorMsg('Batch Number is required.');
    if (!expiryDate) return setErrorMsg('Expiry Date is required.');
    if (!quantity || parseInt(quantity) <= 0) return setErrorMsg('Please enter a valid quantity (> 0).');
    if (!reason.trim()) return setErrorMsg('Please select or specify a reason for return.');
    if (!base64Image) return setErrorMsg('Please upload a clear image of the damaged/expired medicine.');

    setLoading(true);

    try {
      const payload = {
        pharmacy_name: user?.username || 'Pharmacy Pharmacy',
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
        setSuccessMsg('Request submitted successfully! Redirecting to history...');
        setTimeout(() => {
          navigate('/history');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit return request. Ensure the backend server and MySQL database are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <h1 style={titleStyle}>Submit Return Request</h1>
        <p style={subtitleStyle}>Provide stock details and upload a medicine image for AI verification.</p>
      </div>

      <div style={gridStyle}>
        {/* Request Form */}
        <form className="glass-card" style={formCardStyle} onSubmit={handleSubmit}>
          {errorMsg && <div style={errorBannerStyle}>{errorMsg}</div>}
          {successMsg && <div style={successBannerStyle}>{successMsg}</div>}

          <div style={formRowStyle}>
            <div className="form-group" style={{ flex: '1 1 250px' }}>
              <label className="form-label">Medicine Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Paracetamol 500mg, Amoxicillin"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label className="form-label">Batch Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. BATCH-889A"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div style={formRowStyle}>
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label className="form-label">Quantity (Units)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Return</label>
            <select
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Select Reason --</option>
              <option value="Expired Stock">Expired Stock</option>
              <option value="Damaged Packaging">Damaged Packaging</option>
              <option value="Pill Discoloration / Moisture Degradation">Pill Discoloration / Moisture Degradation</option>
              <option value="Product Recall">Product Recall</option>
              <option value="Incorrect Batch Delivery">Incorrect Batch Delivery</option>
            </select>
          </div>

          {/* Image Uploader */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Medicine Photo Upload (Damaged packaging, Blisters or Labels)</label>
            <ImagePreview
              imageFile={imageFile}
              imagePreviewUrl={imagePreviewUrl}
              onRemove={handleRemoveImage}
              onFileChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={submitBtnStyle}
            disabled={loading}
          >
            {loading ? (
              <Loader size="small" message="Uploading and running Gemini AI Analysis..." />
            ) : (
              <>
                <Send size={18} />
                <span>Submit Request</span>
              </>
            )}
          </button>
        </form>

        {/* Guidance Sidepanel */}
        <div style={infoCardWrapperStyle}>
          <div className="glass-card" style={infoCardStyle}>
            <div style={infoTitleGroup}>
              <HelpCircle size={20} color="var(--accent-secondary)" />
              <h3 style={infoTitleStyle}>AI Scanning Guide</h3>
            </div>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <span style={bulletStyle}>1</span>
                <span>Ensure the <strong>Batch Number</strong> and <strong>Expiry Date</strong> are clearly visible in the photo.</span>
              </li>
              <li style={listItemStyle}>
                <span style={bulletStyle}>2</span>
                <span>Take photos in <strong>good lighting</strong> to assist Gemini Pro Vision in reading details correctly.</span>
              </li>
              <li style={listItemStyle}>
                <span style={bulletStyle}>3</span>
                <span>For physical damage, zoom in on the torn foil, crushed pack, or moisture spots.</span>
              </li>
              <li style={listItemStyle}>
                <span style={bulletStyle}>4</span>
                <span>Submitting a request triggers automatic background analysis. Processing may take a few seconds.</span>
              </li>
            </ul>
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

const headerStyle = {
  marginBottom: '8px'
};

const titleStyle = {
  fontSize: '1.8rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em'
};

const subtitleStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  marginTop: '4px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '24px',
  alignItems: 'start',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr'
  }
};

const formCardStyle = {
  padding: '32px',
  borderRadius: '16px'
};

const errorBannerStyle = {
  backgroundColor: 'var(--status-rejected-bg)',
  border: '1px solid rgba(255, 23, 68, 0.25)',
  color: 'var(--status-rejected)',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '20px'
};

const successBannerStyle = {
  backgroundColor: 'var(--status-approved-bg)',
  border: '1px solid rgba(0, 230, 118, 0.25)',
  color: 'var(--status-approved)',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '20px',
  textAlign: 'center'
};

const formRowStyle = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap'
};

const submitBtnStyle = {
  width: '100%',
  padding: '14px',
  fontSize: '1rem',
  borderRadius: '8px'
};

const infoCardWrapperStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const infoCardStyle = {
  padding: '24px',
  borderRadius: '16px'
};

const infoTitleGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '12px'
};

const infoTitleStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const listStyle = {
  listStyleType: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const listItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5'
};

const bulletStyle = {
  backgroundColor: 'rgba(124, 77, 255, 0.15)',
  color: 'var(--accent-secondary)',
  fontWeight: '700',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

export default CreateRequest;
