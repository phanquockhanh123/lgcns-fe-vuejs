import axios from "axios";

const axiosInstance = axios.create({});

axiosInstance.defaults.baseURL = 'http://localhost:8081/api/v1';

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }
)

export default axiosInstance;