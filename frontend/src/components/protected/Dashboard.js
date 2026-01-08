// src/components/protected/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import axios from 'axios';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Obtener perfil del usuario
    axios.get('http://localhost:3001/api/users/profile', {
      headers: authService.authHeader()
    })
    .then(response => {
      setUserProfile(response.data);
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
    });
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      
      <p>
        <strong>Role:</strong> {currentUser.role}
      </p>
      
      {userProfile && (
        <div>
          <h4>User Details:</h4>
          <p>Username: {userProfile.username}</p>
          <p>Email: {userProfile.email}</p>
        </div>
      )}
      
      <div className="mt-4">
        {currentUser.role === 'admin' && (
          <button className="btn btn-secondary me-2">
            Admin Panel
          </button>
        )}
        
        {currentUser.role === 'enfermera' && (
          <button className="btn btn-info me-2">
            Panel Enfermera
          </button>
        )}
        
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;