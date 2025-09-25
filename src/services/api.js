import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "", // Use relative URLs - Netlify will proxy to backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor to add auth token and debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

// // Response interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = localStorage.getItem("refresh_token");
//         if (refreshToken) {
//           // Use relative URL in dev (proxy will handle it), absolute URL in production
//           const refreshURL = import.meta.env.DEV
//             ? "/api/saas/token/refresh/"
//             : "https://pos-backend-mujwh.ondigitalocean.app/api/saas/token/refresh/";

//           const response = await axios.post(refreshURL, {
//             refresh: refreshToken,
//           });

//           const { access } = response.data;
//           localStorage.setItem("access_token", access);

//           originalRequest.headers.Authorization = `Bearer ${access}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(refreshError);
//   }
// );

export default api;
