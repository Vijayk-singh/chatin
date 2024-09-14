import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import ImagePicker from './ImagePicker'; // Ensure ImagePicker is imported correctly
import { useAuth } from '../context/AuthContext'; // Ensure the correct path
import './ProfilePopup.css'; // Import the CSS file for styles

function ProfilePopup({  onClose }) {
  const { setUser ,user} = useAuth(); // Update context with setUser
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [isUpdating, setIsUpdating] = useState(false); // Track if update is in progress
  const [error, setError] = useState(""); // Track error messages
  const [showImagePicker, setShowImagePicker] = useState(false); // State to show/hide image picker

  const handleEdit = (field) => {
    setEditingField(field); // Set the field being edited
  };

  const handleSave = async () => {
    setIsUpdating(true);
    setError("");

    try {
      const response = await axios.put('http://localhost:5000/api/user/editProfile', {
        name,
        email,
        profilePic
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update user context with new data
      // setUser({
      //   name,
      //   email,
      //   profilePic
      // });
     
      onClose(); // Close popup on success
    } catch (err) {
      // Handle error
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null); // Reset editing field
    setShowImagePicker(false); // Hide image picker
  };

  const handleProfilePicChange = (newPic) => {
    setProfilePic(newPic);
    console.log(profilePic)
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button onClick={onClose} className="close-button">X</button>
        <div className="profile-pic">
          <img
            src={profilePic || 'https://img.icons8.com/?size=80&id=2445&format=png&color=000000'}
            alt="Profile"
            className="profile-pic-img"
          />
          <button onClick={() => setShowImagePicker(true)} className="edit-button">Change</button>
        </div>
        <div className="profile-info">
          {showImagePicker && (
            <ImagePicker onImageSelected={handleProfilePicChange} />
          )}
          <div className="info-row">
            <span>Name:</span>
            {editingField === 'name' ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setEditingField(null)}
              />
            ) : (
              <>
                <span>{name}</span>
                <button onClick={() => handleEdit('name')} className="edit-button">Edit</button>
              </>
            )}
          </div>
          <div className="info-row">
            <span>Email:</span>
            {editingField === 'email' ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEditingField(null)}
              />
            ) : (
              <>
                <span>{email}</span>
                <button onClick={() => handleEdit('email')} className="edit-button">Edit</button>
              </>
            )}
          </div>
          {error && <div className="error">{error}</div>}
          <div className="button-container">
            <button onClick={handleSave} className="save-button" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Save'}
            </button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
