import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, AlertCircle, Plus } from 'lucide-react';
import Loader from '../components/Loader';

const Login = ({ handleLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        const userData = response.data.data;
        setSuccessMsg(response.data.message || 'Login successful!');
        
        setTimeout(() => {
          handleLoginSuccess(userData);
          navigate('/dashboard');
        }, 1000);
      } else {
        setErrorMsg(response.data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(backendMessage);
      } else {
        if (
          (username === 'admin' && password === 'admin123') ||
          (username === 'pharmacy' && password === 'pharmacy123')
        ) {
          const role = username === 'admin' ? 'admin' : 'pharmacy';
          const fakeUser = { id: 999, username, role };
          setSuccessMsg('Logged in via offline mode (Fallback)!');
          setTimeout(() => {
            handleLoginSuccess(fakeUser);
            navigate('/dashboard');
          }, 1000);
        } else {
          setErrorMsg('Failed to connect to backend server. Ensure Flask app and MySQL are running, or try using standard offline credentials (admin/admin123, pharmacy/pharmacy123).');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="glass-card" style={loginCardStyle}>
        <div style={logoSectionStyle}>
          <div style={logoWrapperStyle}>
            <Plus size={32} color="#fff" strokeWidth={3} />
          </div>
          <h2 style={titleStyle}>MediReturn</h2>
          <p style={subtitleStyle}>Returns Management System</p>
        </div>

        {errorMsg && (
          <div style={errorContainerStyle}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={successContainerStyle}>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={formStyle}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={inputWrapperStyle}>
              <User size={18} style={iconStyle} />
              <input
                type="text"
                placeholder="e.g. pharmacy or admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                style={inputControlStyle}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Password</label>
            <div style={inputWrapperStyle}>
              <Lock size={18} style={iconStyle} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={inputControlStyle}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={submitButtonStyle}
            disabled={loading}
          >
            {loading ? <Loader size="small" message="" /> : 'Sign In'}
          </button>
        </form>

        <div style={footerStyle}>
          <p>Demo Admin: <code style={codeStyle}>admin / admin123</code></p>
          <p>Demo Pharmacy: <code style={codeStyle}>pharmacy / pharmacy123</code></p>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: 'var(--bg-primary)',
  padding: '16px'
};

const loginCardStyle = {
  width: '100%',
  maxWidth: '440px',
  padding: '40px 32px',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 0.4s ease',
  backgroundColor: 'var(--bg-secondary)',
  boxShadow: 'var(--shadow-lg)'
};

const logoSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: '32px'
};

const logoWrapperStyle = {
  backgroundColor: 'var(--accent-primary)',
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
};

const titleStyle = {
  fontSize: '1.6rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em',
  marginBottom: '6px'
};

const subtitleStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  fontWeight: '500'
};

const errorContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: 'var(--status-rejected-bg)',
  border: '1px solid rgba(220, 38, 38, 0.15)',
  color: 'var(--status-rejected)',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '20px',
  animation: 'fadeIn 0.3s ease'
};

const successContainerStyle = {
  backgroundColor: 'var(--status-approved-bg)',
  border: '1px solid rgba(22, 163, 74, 0.15)',
  color: 'var(--status-approved)',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '20px',
  textAlign: 'center',
  animation: 'fadeIn 0.3s ease'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const inputWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const iconStyle = {
  position: 'absolute',
  left: '16px',
  color: 'var(--text-muted)'
};

const inputControlStyle = {
  paddingLeft: '48px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  fontSize: '0.9rem',
  paddingTop: '10px',
  paddingBottom: '10px'
};

const submitButtonStyle = {
  padding: '12px',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontWeight: '700'
};

const footerStyle = {
  marginTop: '28px',
  paddingTop: '20px',
  borderTop: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  alignItems: 'center',
  fontSize: '0.75rem',
  color: 'var(--text-muted)'
};

const codeStyle = {
  color: 'var(--accent-primary)',
  backgroundColor: 'var(--bg-tertiary)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontWeight: '700',
  border: '1px solid var(--border-color)'
};

export default Login;
