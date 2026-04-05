import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@gravity-ui/uikit';
import { configure } from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import axios from 'axios';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
// Определяем API URL в зависимости от окружения
let API_URL;

if (import.meta.env.PROD) {
  // Для продакшена - ваш Render/Heroku/Railway URL
  API_URL = 'https://backmy-o8lb.onrender.com'; // ЗАМЕНИТЕ на ваш реальный URL
} else {
  // Для разработки
  API_URL = 'http://localhost:5000';
}

console.log('🌐 API URL:', API_URL);
console.log('🚀 Environment:', import.meta.env.PROD ? 'production' : 'development');

// Настройка axios
axios.defaults.baseURL = API_URL;

// Добавляем interceptor для токена
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Обработка ошибок
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('📡 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      console.warn('🔐 Сессия истекла, требуется повторный вход');
    }
    
    // Для сетевых ошибок показываем понятное сообщение
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Сетевая ошибка. Проверьте:');
      console.error('1. Запущен ли сервер?');
      console.error('2. Правильный ли API_URL?', API_URL);
      console.error('3. Есть ли CORS ошибки?');
    }
    
    return Promise.reject(error);
  }
);

// Настройка языка
configure({ lang: 'ru' });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme="dark">
      <App />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  </React.StrictMode>
);