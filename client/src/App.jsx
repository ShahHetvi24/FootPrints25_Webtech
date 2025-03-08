import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/Homepage';
import Login from './components/Loginpage';
import ChatWindow from './components/ChatWindow';
import Teatok from './components/TeatokPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teatok" element={<Teatok />} />
          <Route path="/chat" element={<ChatWindow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;