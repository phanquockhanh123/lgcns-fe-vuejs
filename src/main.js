import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081/api/v1';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
      return Promise.reject(error);
  }
)

axios.interceptors.response.use(
  function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  }
)

const app = createApp(App)

app.use(router)

app.use(Antd)


app.mount('#app')
