// empleadosApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/empleados'; // Ajusta el puerto si es diferente

export const actualizarEmpleado = async (id, datos) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, datos);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const verificarContrasena = async (id, contrasena) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/verificar-contrasena`, { contrasena });
    return response.data; // { igual: true/false }
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
