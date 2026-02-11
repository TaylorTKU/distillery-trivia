import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// Temporary imports for pages we will create
import Registration from './pages/Registration';
import LiveDisplay from './pages/LiveDisplay';
import HostDashboard from './pages/HostDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/live" element={<LiveDisplay />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
