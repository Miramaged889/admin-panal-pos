import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const loginSaaSAdmin = createAsyncThunk(
  "auth/loginSaaSAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post("api/saas/login/", credentials);

      const { token } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", token.access);
      localStorage.setItem("refresh_token", token.refresh);

      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        return rejectWithValue({
          message:
            error.response.data?.message ||
            error.response.data?.detail ||
            "Login failed",
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        // Network error
        return rejectWithValue({
          message: "Network error - please check your connection",
          status: 0,
          data: null,
        });
      } else {
        // Other error
        return rejectWithValue({
          message: error.message || "Login failed",
          status: 0,
          data: null,
        });
      }
    }
  }
);

export const logoutSaaSAdmin = createAsyncThunk(
  "auth/logoutSaaSAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/saas/logout/");
      return true;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Logout failed",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/saas/me/");
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to get user info",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginSaaSAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSaaSAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload;
        state.error = null;
      })
      .addCase(loginSaaSAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutSaaSAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutSaaSAdmin.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .addCase(logoutSaaSAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
