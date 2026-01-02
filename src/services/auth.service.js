const API_URL = 'http://localhost:3001/api';

// Obtener usuario del localStorage
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario del localStorage:', error);
    return null;
  }
};

// Guardar usuario en localStorage
const storeUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar usuario en localStorage:', error);
  }
};

// Eliminar usuario del localStorage
const removeStoredUser = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error al eliminar usuario del localStorage:', error);
  }
};

const authService = {
  // Verificar conexión con backend
  checkBackendHealth: async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      return {
        success: response.ok,
        message: data.message,
        database: data.database
      };
    } catch (error) {
      console.error('Error checking backend health:', error);
      return {
        success: false,
        message: 'No se pudo conectar con el servidor',
        database: 'Desconectado'
      };
    }
  },

  // Registrar usuario
  register: async (usuario, nombre, password) => {
    try {
      console.log('Enviando datos de registro:', { usuario, nombre, password });

      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario,
          nombre,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Error en el registro',
          details: data.details
        };
      }

      return {
        success: true,
        message: data.message,
        id: data.id
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  },

  // Login de usuario
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

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Error en el login'
        };
      }

      // Guardar usuario en localStorage
      if (data.user) {
        storeUser(data.user);
      }

      return {
        success: true,
        message: data.message,
        user: data.user
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  },

  // Obtener usuario actual del localStorage
  getCurrentUser: () => {
    return getStoredUser();
  },

  // Cerrar sesión
  logout: () => {
    removeStoredUser();
    return { success: true, message: 'Sesión cerrada exitosamente' };
  },

  // Verificar si hay usuario autenticado
  isAuthenticated: () => {
    const user = getStoredUser();
    return !!user;
  },

  // Obtener información del usuario
  getUserInfo: () => {
    const user = getStoredUser();
    if (user) {
      return {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre
      };
    }
    return null;
  },

  // Método para obtener todos los usuarios
  getUsuarios: async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  },

  // Método para probar conexión directa
  testRegister: async (testData) => {
    try {
      const response = await fetch(`${API_URL}/test-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      return await response.json();
    } catch (error) {
      console.error('Error en test:', error);
      return { success: false, message: 'Error en test' };
    }
  }
};

export default authService;