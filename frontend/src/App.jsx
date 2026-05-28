import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import RequestHistory from './pages/RequestHistory';
import AdminPanel from './pages/AdminPanel';
import RequestDetails from './pages/RequestDetails';
import NotFound from './pages/NotFound';

// Protected Route Wrapper Component
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout Shell Wrapper Component
const AppLayout = ({ user, handleLogout, children }) => {
  const location = useLocation();
  
  // Dynamic page title mapping based on route path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'System Dashboard';
    if (path === '/create-request') return 'Submit Return Request';
    if (path === '/history') return 'Pharmacy Request History';
    if (path === '/admin') return 'Admin Verification Console';
    if (path.startsWith('/request/')) return 'Request Details';
    return 'Pharmacy Returns System';
  };

  return (
    <div style={layoutContainerStyle}>
      <Sidebar user={user} handleLogout={handleLogout} />
      <div style={mainContentStyle}>
        <Navbar title={getPageTitle()} user={user} />
        <main style={pageBodyStyle}>
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    // Check local storage for dummy authentication session
    const storedUser = localStorage.getItem('pharmacy_session');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('pharmacy_session');
      }
    }
    setBootstrapping(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('pharmacy_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pharmacy_session');
  };

  if (bootstrapping) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Initializing RX System...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Login handleLoginSuccess={handleLoginSuccess} />
          } 
        />

        {/* Protected Routes inside Layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} handleLogout={handleLogout}>
                <Dashboard user={user} />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/create-request" 
          element={
            <ProtectedRoute user={user} allowedRoles={['pharmacy']}>
              <AppLayout user={user} handleLogout={handleLogout}>
                <CreateRequest user={user} />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/history" 
          element={
            <ProtectedRoute user={user} allowedRoles={['pharmacy']}>
              <AppLayout user={user} handleLogout={handleLogout}>
                <RequestHistory user={user} />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AppLayout user={user} handleLogout={handleLogout}>
                <AdminPanel user={user} />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/request/:id" 
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} handleLogout={handleLogout}>
                <RequestDetails user={user} />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        {/* Home Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all 404 Route */}
        <Route 
          path="*" 
          element={
            <AppLayout user={user} handleLogout={handleLogout}>
              <NotFound />
            </AppLayout>
          } 
        />
      </Routes>
    </Router>
  );
};

// Layout CSS Styles
const layoutContainerStyle = {
  display: 'flex',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: 'var(--bg-primary)'
};

const mainContentStyle = {
  flex: 1,
  marginLeft: '260px', // Matches Sidebar width
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0 // Prevents grid overflow issues
};

const pageBodyStyle = {
  flex: 1,
  padding: '32px',
  overflowY: 'auto'
};

export default App;
