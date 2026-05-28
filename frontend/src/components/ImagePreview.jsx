import React from 'react';
import { Upload, X } from 'lucide-react';

const ImagePreview = ({ imageFile, imagePreviewUrl, onRemove, onFileChange }) => {
  return (
    <div style={containerStyle}>
      {imagePreviewUrl ? (
        <div style={previewWrapperStyle}>
          <img src={imagePreviewUrl} alt="Medicine Upload Preview" style={imageStyle} />
          <button type="button" onClick={onRemove} style={removeButtonStyle} title="Remove image">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label style={uploadAreaStyle}>
          <Upload size={28} style={iconStyle} />
          <span style={textStyle}>Upload Medicine Image</span>
          <span style={subtextStyle}>Supports JPG, PNG, WEBP (Max 5MB)</span>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: 'none' }}
          />
        </label>
      )}
    </div>
  );
};

const containerStyle = {
  width: '100%',
  marginTop: '8px'
};

const previewWrapperStyle = {
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)',
  maxHeight: '260px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'var(--bg-secondary)'
};

const imageStyle = {
  maxWidth: '100%',
  maxHeight: '260px',
  objectFit: 'contain'
};

const removeButtonStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: 'rgba(255, 23, 68, 0.9)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  padding: '0'
};

const uploadAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 16px',
  border: '2px dashed var(--border-color)',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-secondary)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center'
};

const iconStyle = {
  color: 'var(--accent-primary)',
  marginBottom: '8px'
};

const textStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: 'var(--text-primary)'
};

const subtextStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  marginTop: '4px'
};

export default ImagePreview;
