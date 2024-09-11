import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import './login.css'; // Import the CSS file
import NotificationPopup from './minicomp/NotificationPopup';


function Login() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(''); 
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  // Login function
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', { email, password });
      const { token, name, _id } = response.data;
      localStorage.setItem("token", token); // Save token
      localStorage.setItem("name", name);
      localStorage.setItem("userId", _id);
      navigate('/'); // Navigate to Home after login
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  // Register function
  const register = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', { email, password, name, profilePic });
      const { token, name: userName, _id } = response.data;
      console.log(response)
      localStorage.setItem("token", token); // Save token
      localStorage.setItem("name", userName);
      localStorage.setItem("userId", _id);
      setNotification(response.statusText)
      // navigate('/home'); // Navigate to Home after registration
    } catch (error) {
      console.error('Registration Error:', error);
     
      // return <NotificationPopup message="This is a notification!" color="green" />
    }
   
  };

  // Toggle form
  const toggleForm = () => {
    setIsLogin(!isLogin); // Switch between login and register
  };

  return (
    <div>
      <Header />
      {notification?(<NotificationPopup message={notification} color={notification=="Created"?"green":"red"}/>):("")}
      <div className="centered">
        {/* Toggle between Login and Register */}
        <button onClick={toggleForm} className="button-style">
          {isLogin ? "Want to Register" : "Want to Login"}
        </button>
      </div>

      {isLogin ? (
        <div className="form-container">
          <h2>Login</h2>
          <img src="https://t3.ftcdn.net/jpg/07/67/46/04/240_F_767460462_2YyFXqodCjSCsAIsURvtOuowofqBK0E7.jpg" height="100px"/>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-style"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-style"
            required
          />
          <button onClick={login} className="button-style">Login</button>
        </div>
      ) : (
        <div className="form-container">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-style"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-style"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-style"
            required
          />
          <input
            type="text"
            placeholder="Profile Picture URL"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            className="input-style"
          />
          <button onClick={register} className="button-style">Register</button>
        </div>
      )}
    </div>
  );
}

export default Login;
