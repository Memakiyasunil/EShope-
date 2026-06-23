import axios from 'axios';
import { setCredentials, logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? `${window.location.protocol}//${window.location.hostname}:5000/api` : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let store;

export const injectStore = (_store) => {
  store = _store;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const accessToken = store?.getState()?.auth?.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        store?.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authState = store?.getState()?.auth || {};
      const { refreshToken, user } = authState;

      if (!refreshToken) {
        store?.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken || data.token;
        const newRefreshToken = data.refreshToken || refreshToken;

        store?.dispatch(
          setCredentials({
            user: data.user || user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store?.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
