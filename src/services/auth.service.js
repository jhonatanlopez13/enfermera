// src/services/auth.service.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/';

const register = (usuario, nombre, password, rol_id = 3) => {
  return axios.post(API_URL + 'signup', {
    usuario,
    nombre,
    password,
    rol_id
  });
};

// Función para iniciar sesión
const login = (usuario, password) => {
  return axios.post(API_URL + 'signin', {
    usuario,
    password
  }).then(response => {
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getRoles = () => {
  return axios.get(API_URL + 'roles');
};

const verifyToken = () => {
  const user = getCurrentUser();
  if (!user || !user.token) {
    return Promise.reject('No hay usuario autenticado');
  }
  
  return axios.get(API_URL + 'verify', {
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  });
};

const authHeader = () => {
  const user = getCurrentUser();
  
  if (user && user.token) {
    return { 
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    };
  } else {
    return {};
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getRoles,
  verifyToken,
  authHeader
};