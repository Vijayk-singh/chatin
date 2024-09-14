import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
// Home Component: List of users
function Home() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/user/allusers', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      if (token) {
        fetchUsers();
      }
    }, []);
    useEffect(() => {
        const token1 = localStorage.getItem('token');
        if (!token1) {
          navigate('/login');  // Navigate to login if no token
        }
      }, [navigate]);
    // Handler function to navigate to chat page
    const handleUserClick = (userId,username) => {
      navigate(`/chat/${userId}`);
      localStorage.setItem("user2Id", userId);
      localStorage.setItem("user2name", username);
    };
  
    return (
        <div>
             <Header />
      <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '20px' }}>
     
      <h2 style={{ textAlign: 'center' }}>All Users</h2>
      <ul style={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: '0',
        listStyle: 'none',
        margin: '0'
      }}>
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user._id, user.name)}
            style={{
              flex: '1 1 240px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ddd',
              borderRadius: '8px',
              margin: '10px',
              padding: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              backgroundColor: '#fff',
              // minWidth:'90%',
              // maxWidth:'220px'
            }}
          >
            <img
              alt="profile"
              src="https://img.icons8.com/?size=50&id=13042&format=png&color=000000"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                marginRight: '10px',
                border: '1px solid black',
                padding:'5px'
              }}
            />
            <div>
              <h4 style={{ margin: '0', fontSize: '16px', color: '#333' }}>{user.name}</h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
    );
  }
   export default Home;