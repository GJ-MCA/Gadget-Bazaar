import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../helpers/userHelper';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const history = useHistory();
  const token = localStorage.getItem('auth-token');

  useEffect(() => {
    getUserProfile(token)
      .then((data) => {
        setUserProfile(data.user);
        setName(data.user.name);
        setContact(data.user.contact);
      })
      .catch((err) => console.log(err));
  }, [token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setName(userProfile.name);
    setContact(userProfile.contact);
  };

  const handleSaveClick = () => {
    const updatedProfile = {
      ...userProfile,
      name,
      contact,
    };
    updateUserProfile(token, updatedProfile)
      .then(() => {
        setIsEditing(false);
        setUserProfile(updatedProfile);
      })
      .catch((err) => console.log(err));
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('auth-token');
    history.push('/login');
  };

  return (
    <div className='container profile-container'>
      <h2>Profile</h2>
      <div className='profile-details'>
        <div className='detail'>
          <div className='label'>Name:</div>
          {isEditing ? (
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <div className='value'>{userProfile.name}</div>
          )}
        </div>
        <div className='detail'>
          <div className='label'>Email:</div>
          <div className='value'>{userProfile.email}</div>
        </div>
        <div className='detail'>
          <div className='label'>Contact:</div>
          {isEditing ? (
            <input
              type='text'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          ) : (
            <div className='value'>{userProfile.contact}</div>
          )}
        </div>
        <div className='detail'>
          <div className='label'>Role:</div>
          <div className='value'>{userProfile.role}</div>
        </div>
        {isEditing ? (
          <div className='buttons'>
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        ) : (
          <button onClick={handleEditClick}>Edit Profile</button>
        )}
      </div>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default Profile;
