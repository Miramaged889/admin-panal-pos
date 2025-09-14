import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchTenantUsers = createAsyncThunk(
  "tenantUsers/fetchTenantUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/saas/tenantusers/");
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch tenant users",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const createTenantUser = createAsyncThunk(
  "tenantUsers/createTenantUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/saas/addtenantusers/", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to create tenant user",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const updateTenantUser = createAsyncThunk(
  "tenantUsers/updateTenantUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/saas/tenantusers/${id}/`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to update tenant user",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const deleteTenantUser = createAsyncThunk(
  "tenantUsers/deleteTenantUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/saas/tenantusers/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to delete tenant user",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const getTenantUserById = createAsyncThunk(
  "tenantUsers/getTenantUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/saas/tenantusers/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to get tenant user",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const initialState = {
  tenantUsers: [],
  currentTenantUser: null,
  loading: false,
  error: null,
  success: null,
};

const tenantUsersSlice = createSlice({
  name: "tenantUsers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentTenantUser: (state, action) => {
      state.currentTenantUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tenant users
      .addCase(fetchTenantUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.tenantUsers = action.payload;
      })
      .addCase(fetchTenantUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to fetch tenant users";
      })
      // Create tenant user
      .addCase(createTenantUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenantUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tenantUsers.push(action.payload);
        state.success = "Tenant user created successfully";
      })
      .addCase(createTenantUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to create tenant user";
      })
      // Update tenant user
      .addCase(updateTenantUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenantUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tenantUsers.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.tenantUsers[index] = action.payload;
        }
        state.success = "Tenant user updated successfully";
      })
      .addCase(updateTenantUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to update tenant user";
      })
      // Delete tenant user
      .addCase(deleteTenantUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenantUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tenantUsers = state.tenantUsers.filter(
          (user) => user.id !== action.payload
        );
        state.success = "Tenant user deleted successfully";
      })
      .addCase(deleteTenantUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to delete tenant user";
      })
      // Get tenant user by ID
      .addCase(getTenantUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTenantUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTenantUser = action.payload;
      })
      .addCase(getTenantUserById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to get tenant user";
      });
  },
});

export const { clearError, clearSuccess, setCurrentTenantUser } =
  tenantUsersSlice.actions;
export default tenantUsersSlice.reducer;
