const API_URL = 'http://localhost:3001/api';

export const enfermeraService = {
  // Obtener pruebas médicas
  async getPruebasMedicas(enfermeraId) {
    try {
      const response = await fetch(`${API_URL}/enfermera/pruebas?enfermeraId=${enfermeraId}`);
      if (!response.ok) throw new Error('Error al obtener pruebas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Crear nueva prueba
  async createPrueba(pruebaData) {
    try {
      const response = await fetch(`${API_URL}/enfermera/pruebas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pruebaData),
      });
      if (!response.ok) throw new Error('Error al crear prueba');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Actualizar prueba
  async updatePrueba(id, updateData) {
    try {
      const response = await fetch(`${API_URL}/enfermera/pruebas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Error al actualizar prueba');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Eliminar prueba
  async deletePrueba(id) {
    try {
      const response = await fetch(`${API_URL}/enfermera/pruebas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar prueba');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Obtener turnos del mes
  async getTurnosMes(enfermeraId, year, month) {
    try {
      const response = await fetch(
        `${API_URL}/enfermera/turnos?enfermeraId=${enfermeraId}&year=${year}&month=${month}`
      );
      if (!response.ok) throw new Error('Error al obtener turnos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Registrar asistencia
  async registrarAsistencia(turnoId, asistenciaData) {
    try {
      const formData = new FormData();
      Object.keys(asistenciaData).forEach(key => {
        if (key === 'evidencia_foto' && asistenciaData[key]) {
          formData.append('evidencia_foto', asistenciaData[key]);
        } else {
          formData.append(key, asistenciaData[key]);
        }
      });

      const response = await fetch(`${API_URL}/enfermera/turnos/${turnoId}/asistencia`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error al registrar asistencia');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Obtener pacientes
  async getPacientes() {
    try {
      const response = await fetch(`${API_URL}/enfermera/pacientes`);
      if (!response.ok) throw new Error('Error al obtener pacientes');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async getEstadisticas(enfermeraId) {
    try {
      const response = await fetch(`${API_URL}/enfermera/estadisticas?enfermeraId=${enfermeraId}`);
      if (!response.ok) throw new Error('Error al obtener estadísticas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};