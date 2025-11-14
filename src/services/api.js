import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL:  "https://posback.shop", // Use relative URLs in dev, absolute in production
  timeout: 30000, // Increased timeout to 30 seconds
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

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("❌ API Response Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      isCancel: error.name === "CanceledError" || error.code === "ERR_CANCELED",
      isTimeout: error.code === "ECONNABORTED",
      isNetwork: !error.response && !error.request,
    });
    return Promise.reject(error);
  }
);


export default api;
