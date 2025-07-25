// api.js
import axios from 'axios';
import { retrieveRefreshToken, retrieveToken, storeToken, storeRefreshToken, retrieveUserId, storeUserId } from './helper.js';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(async (config) => {
  const token = await retrieveToken();
  const userId = await retrieveUserId();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.UserId = userId;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // const refreshToken = localStorage.getItem('refreshToken');
        const currentUserId = await retrieveUserId();
        const refreshToken = await retrieveRefreshToken();

        const response = await axios.post('http://localhost:3000/refresh', {
          refreshToken,
        }, {
          headers: {
            UserId: currentUserId
          }
        });

        const userId = response.data.body.emailId;
        const newToken = response.data.body.token;
        const newRefreshToken = response.data.body.refreshToken;
        // localStorage.setItem('accessToken', newAccessToken);
        storeUserId(userId)
        storeToken(newToken);
        storeRefreshToken(newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry the original request
      } catch (err) {
        // logout if Refresh Token is also expired
        storeUserId("-")
        storeToken("-");
        storeRefreshToken("-");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
