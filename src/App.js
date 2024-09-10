import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import Header from './Header';


// Login Component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', { email, password });
      console.log(response.data)
      const { token, name, _id } = response.data;
      localStorage.setItem("token", token); // Save token
      localStorage.setItem("name", name);
      localStorage.setItem("userId", _id);
      navigate('/home'); // Navigate to Home after login
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <div>
      <Header/>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}

// Home Component: List of users


function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
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

  // Handler function to navigate to chat page
  const handleUserClick = (userId) => {
    navigate(`/chat/${userId}`);
    localStorage.setItem("user2Id",userId)
  };

  return (
    <div>
      <Header />
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => handleUserClick(user._id)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}




// Chat Component: Chat between two users
function Chat(selectedUserId) {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [chatId, setChatId] = useState('');
  const { userId } = selectedUserId;

  useEffect(() => {
    // const token = localStorage.getItem("token");

    const createChat = async () => {
      try {
        // const { userId } = useParams();
        // console.log(userId)
        const currentUserId = localStorage.getItem("userId");
        const token = localStorage.getItem("token"); // Ensure token is retrieved from local storage
        const selectedUserId = localStorage.getItem("user2Id");
    
        if (!currentUserId ) {
          console.error('Missing required parameters: currentUserId, selectedUserId, or token');
          return;
        }
    
        // Post request to create or access a chat
        const response = await axios.post('http://localhost:5000/api/chat', {
          currentUserId,
          selectedUserId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        // Ensure that the response contains the chat ID
        if (response.data ) {
          console.log(response.data.chatId)
          setChatId(response.data.chatId); // Save the chat ID
        } else {
          console.error('Invalid response structure:', response.data);
        }
      } catch (error) {
        console.error('Error accessing or creating chat:', error.response ? error.response.data : error.message);
      }
    };
    

    createChat();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMessages = async () => {
      if (!chatId) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/message/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post('http://localhost:5000/api/message', {
        chatId,
        content: messageContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessageContent('');
      const response = await axios.get(`http://localhost:5000/api/message/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <Header/>
      <h2>Chat</h2>
      <div>
        {messages.map((msg) => (
          <p key={msg._id}>
            <strong>{msg.sender.name}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <div>
        <input type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
