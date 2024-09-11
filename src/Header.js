import React from 'react';

function Header() {
  const user = localStorage.getItem("name");

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
     // Reload the page to reflect logout
     window.location.reload();
  };

  return (
    <header style={headerStyle}>
      {/* Left Container with Logo */}
      <div style={leftContainerStyle}>
        <img
          src='https://img.icons8.com/?size=80&id=fSAYtXZSjBaV&format=png&color=000000'
          style={{ width: '50px', height: '50px', borderRadius: '70px' }}
          alt="Logo"
        />
        <p style={h2Style}>Chat!n</p>
      </div>

      {/* Center Container with Welcome Message */}
      <div style={centerContainerStyle}>
        {user ? <> {user}</> : <>Please Login</>}
      </div>

      {/* Right Container with Logout */}
      <div style={rightContainerStyle}>
        <img src='https://img.icons8.com/?size=30&id=2445&format=png&color=000000' alt="Logout Icon" />
        <button onClick={Logout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;

// Core CSS styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#f4f4f4',
  borderBottom: '2px solid #ddd',
  flexWrap: 'wrap',  // Allows wrapping on smaller screens
  // height:'80px'
};

const leftContainerStyle = {
  textAlign:"center",
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,  // Prevent shrinking of the left container
};

const h2Style = {
  margin: '0 0 0 10px',
  fontSize: '20px',
  fontWeight: 'light',
  
};

// Center Container style (flex-grow for centering)
const centerContainerStyle = {
  flexGrow: 1,  // Take up available space
  textAlign: 'center',
  fontSize: 'px',
};

// Right Container style
const rightContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

// Logout Button style
const logoutButtonStyle = {
  padding:'2px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '16px',
  color: 'black',
  borderBottom:'1px solid #fff'
};
