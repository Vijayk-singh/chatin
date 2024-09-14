import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componants/Login';
import Home from './componants/Home';
import Chat from './componants/Chat';
import { useAuth } from './context/AuthContext'; // Import useAuth to check login status


const App = () => {
  const { isLoggedIn } = useAuth(); // Access authentication status

  return (
  
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:userId"
          element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
