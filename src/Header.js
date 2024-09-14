import React, { useContext, useState } from 'react';
import { useAuth } from './context/AuthContext';
import ProfilePopup from './componants/ProfilePopup'; // Fixed typo in import path
import './Header.css'; // Import the CSS file

function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openProfilePopup = () => {
    setProfilePopupOpen(true);
    setMenuOpen(false);
  };

  const closeProfilePopup = () => {
    setProfilePopupOpen(false);
  };
// console.log(user)
  return (
    <header>
      <div className="left-container">
        <img
          src='https://img.icons8.com/?size=80&id=fSAYtXZSjBaV&format=png&color=000000'
          alt="Logo"
        />
        <p>Chat!n</p>
      </div>

      <div className="center-container">
        {user ? <>Welcome, {user.name}</> : <>Please Login</>}
      </div>

      <div className="right-container">
        {user && (
          <>
            <img
              src={user.profilePic || 'https://img.icons8.com/?size=30&id=2445&format=png&color=000000'}
              alt="User"
              onClick={toggleMenu}
              style={{ cursor: 'pointer' }} // Added cursor style for better UX
            />
            {menuOpen && (
              <div className="menu">
                <div className="menu-item">
                  <img
                    src={user.profilePic || 'https://img.icons8.com/?size=30&id=2445&format=png&color=000000'}
                    alt="User"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }} // Added style for user image
                  />
                  <p>{user.name}</p>
                  <p style={{ fontSize: "10px", color: "GrayText" }}>{user.email}</p>
                  <div className="viewprofilebtn">
                    <button onClick={openProfilePopup}>View Profile</button>
                  </div>
                </div>
                <div className="menu-item">
                  <button>Settings</button>
                </div>
                <div className="menu-item">
                  <button>About Us</button>
                </div>
                <div className="menu-item">
                  <p onClick={handleLogout} className="logout">Logout</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {profilePopupOpen && (
        <ProfilePopup user={user} onClose={closeProfilePopup} />
      )}
    </header>
  );
}

export default Header;
