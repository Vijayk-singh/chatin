import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  // Function to load user data from localStorage
  const loadUserData = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUser({
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        profilePic: localStorage.getItem("pic"),
      });
    } else {
      setIsLoggedIn(false);
      setUser({});
    }
  };

  useEffect(() => {
    loadUserData();
  }, [5]);

  const login = ({ token, name, _id, email, profilePic }) => {
    // Set user data in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("userId", _id);
    localStorage.setItem("email", email);
    localStorage.setItem("pic", profilePic);
    
    // Update context state
    setIsLoggedIn(true);
    setUser({ name, email, profilePic });
  };

  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("pic");
    
    // Reset context state
    setIsLoggedIn(false);
    setUser({});
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
