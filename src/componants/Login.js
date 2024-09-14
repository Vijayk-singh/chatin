import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Header from "../Header";
import "./login.css";
import NotificationPopup from "./minicomp/NotificationPopup";
import ImagePicker from "./ImagePicker";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [notification, setNotification] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }
      );
      const { token, name: userName, _id, email: userEmail, profilePic } = response.data;
  
      // Pass the token and user details to login function
      login({ token, name: userName, _id, email: userEmail, profilePic });
      navigate("/"); // Navigate to Home after login
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        { email, password, name, profilePic }
      );
      const { token, name: userName, _id } = response.data;
      login({ token, name: userName, _id });
      setNotification(response.statusText);
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email: "guest@user.com", password: "123456" }
      );
      const { token, name: userName, _id, email: userEmail, profilePic } = response.data;
  
      // Pass the token and user details to login function
      login({ token, name: userName, _id, email: userEmail, profilePic });
      navigate("/"); // Navigate to Home after guest login
    } catch (error) {
      console.error("Guest Login Error:", error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <Header />
      {notification && (
        <NotificationPopup
          message={notification}
          color={notification === "Created" ? "green" : "red"}
        />
      )}
      <div className="centered">
        <button onClick={toggleForm} className="button-style">
          {isLogin ? "Want to Register" : "Want to Login"}
        </button>
        <button onClick={handleGuestLogin} className="button-style">
          Guest Login
        </button>
      </div>

      {isLogin ? (
        <div className="form-container">
          <h2>Login</h2>
          <img
            src="https://t3.ftcdn.net/jpg/07/67/46/04/240_F_767460462_2YyFXqodCjSCsAIsURvtOuowofqBK0E7.jpg"
            height="100px"
            alt="Login"
          />
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="button-style">
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="form-container">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
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
            {/* <ImagePicker /> */}
            <button type="submit" className="button-style">
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
