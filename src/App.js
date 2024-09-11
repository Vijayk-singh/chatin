import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // Import Socket.IO
import Header from './Header';
import Login from './componants/Login';
import Home from './componants/Home'
import Chat from './componants/Chat';

const ENDPOINT = "http://localhost:5000"; // Backend server endpoint









function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={localStorage.getItem('token')?<Home/>:<Login/>} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/chat/:userId" element={<Chat/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
