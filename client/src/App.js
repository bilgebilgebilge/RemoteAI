import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import Dashboard from './pages/Dashboard';
import RemoteControl from './pages/RemoteControl';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/remote/:id" element={<RemoteControl />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;