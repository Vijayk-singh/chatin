import React from 'react';

function Header() {
  // Inline core CSS styles
  const headerStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px'
  };
 const user =localStorage.getItem("name");
  return (
    <header style={headerStyle}>
     {
        user?(<>Welcome {user}</>):(<>Please Login</>)
     }
    </header>
  );
}

export default Header;
