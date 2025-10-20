<<<<<<< HEAD
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/empleados";

// Función para actualizar un empleado
export const actualizarEmpleado = async (id, datos) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, datos);
    return res.data; // aquí viene { message, empleado }
  } catch (err) {
    // Si hay respuesta del servidor
    if (err.response) {
      console.error("Error response:", err.response.data); // para ver en consola
      throw err.response.data; // lanza exactamente lo que envía el backend
    } 
    // Si hay error de red o Axios
    else if (err.request) {
      console.error("Error request:", err.request);
      throw { error: "No se recibió respuesta del servidor" };
    } 
    // Otro tipo de error
    else {
      console.error("Error desconocido:", err.message);
      throw { error: err.message || "Error desconocido" };
    }
  }
};


// Función para obtener empleados ausentes
export const obtenerAusentes = async () => {
  try {
    const res = await axios.get(`${API_URL}/ausentes`);
    return res.data; // lista de empleados ausentes
  } catch (err) {
    throw err.response?.data || { error: "Error al obtener empleados ausentes" };
=======
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
>>>>>>> josue
  }
};
