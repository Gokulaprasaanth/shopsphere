import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor: Attach token to headers
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if the refresh token itself fails
    if (originalRequest.url === '/auth/refresh') {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-expired'));
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userString = localStorage.getItem('user');
        if (!userString) throw new Error('No user found');
        
        const user = JSON.parse(userString);
        if (!user.refreshToken) throw new Error('No refresh token found');

        // Attempt to get a new access token
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          refreshToken: user.refreshToken
        });

        // Update the user object with the new tokens
        const updatedUser = { 
          ...user, 
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails, log the user out
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-expired'));
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
