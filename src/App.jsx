import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateComplaint from './pages/CreateComplaint';
import LandingPage from './pages/LandingPage';
import ChatBot from './components/ChatBot';   // ✅ ADD THIS

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("App Crash:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', color: 'white', textAlign: 'center', background: '#0f172a', minHeight: '100vh' }}>
          <h1 style={{ color: '#ef4444' }}>Oops! Something went wrong.</h1>
          <p style={{ marginTop: '20px', color: '#94a3b8' }}>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '30px', padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <Navbar user={user} setUser={setUser} />

          <main className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/report-issue" element={user ? <CreateComplaint user={user} /> : <Navigate to="/login" />} />
            </Routes>
          </main>

          {/* ✅ CHATBOT ADDED HERE */}
          <ChatBot />

        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;