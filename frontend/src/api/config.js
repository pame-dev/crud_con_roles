import axios from 'axios';
// Configuración centralizada de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Instancia de Axios configurada
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Crucial para CORS
});

export default API_URL;
