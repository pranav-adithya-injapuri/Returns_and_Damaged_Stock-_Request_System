import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Filter, Users } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import RequestTable from '../components/RequestTable';
import Loader from '../components/Loader';

const AdminPanel = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      let url = `http://localhost:5000/api/requests?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}`;
      const response = await axios.get(url);
      
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not pull requests from live server. Displaying simulated administrative view instead.');
      // Offline fallback dummy requests for all pharmacies
      const dummyData = [
        { id: 1, pharmacy_name: 'Metro Care Pharmacy', medicine_name: 'Ibuprofen 400mg', batch_number: 'IBU-99081', expiry_date: '2025-10-31', quantity: 150, reason: 'Expired Stock', status: 'Approved', created_at: '2026-05-28 12:00:00' },
        { id: 2, pharmacy_name: 'City Health Rx', medicine_name: 'Amoxicillin 500mg', batch_number: 'AMO-7762', expiry_date: '2027-02-15', quantity: 80, reason: 'Damaged Packaging', status: 'Pending', created_at: '2026-05-28 12:45:10' },
        { id: 3, pharmacy_name: 'Sunrise Pharmacy', medicine_name: 'Vitamin D3 1000IU', batch_number: 'VIT-102', expiry_date: '2024-04-12', quantity: 200, reason: 'Expired Stock', status: 'Rejected', created_at: '2026-05-27 10:15:00' }
      ];
      const match = dummyData.filter(req => {
        const matchesSearch = req.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              req.pharmacy_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              req.batch_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
      setRequests(match);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [searchTerm, statusFilter]);

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Admin Verification Panel</h1>
          <p style={subtitleStyle}>Review and authenticate incoming return requests and inspect Gemini AI image analysis.</p>
        </div>
      </div>

      {errorMsg && (
        <div style={warningStyle}>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar Row */}
      <div style={filterRowStyle} className="glass-card">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search by pharmacy, medicine, or batch..." 
        />
        
        <div style={selectWrapperStyle}>
          <Filter size={16} style={filterIconStyle} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <Loader message="Fetching requests logs for verification..." />
      ) : (
        <RequestTable requests={requests} />
      )}
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

const warningStyle = {
  backgroundColor: 'rgba(255, 215, 0, 0.08)',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  color: 'var(--status-pending)',
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const filterRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderRadius: '12px',
  flexWrap: 'wrap',
  gap: '16px'
};

const selectWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const filterIconStyle = {
  position: 'absolute',
  left: '12px',
  color: 'var(--text-muted)'
};

const selectStyle = {
  padding: '10px 16px 10px 36px',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-family)',
  outline: 'none',
  cursor: 'pointer',
  minWidth: '150px'
};

export default AdminPanel;
