import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Certifique-se de que a porta coincide com a do seu Spring Boot
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para injetar o token JWT em cada requisição se ele existir no localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@CondoManager:token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;