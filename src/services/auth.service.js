const API_URL = 'http://localhost:3001/api';

const authService = {
  checkBackendHealth: async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: 'Backend no responde' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  login: async (usuario, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        return {
          success: true,
          message: 'Login exitoso',
          user: data.user
        };
      } else {
        return {
          success: false,
          message: data.error || 'Error en el login'
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  },

  // Método para guardar usuario (por si acaso)
  saveUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return localStorage.getItem('user') !== null;
  }
};

export default authService;