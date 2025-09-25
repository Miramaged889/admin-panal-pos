import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchManagers = createAsyncThunk(
  "managers/fetchManagers",
  async (subdomain, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/saas/managers/?schema=${subdomain}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch managers"
      );
    }
  }
);

export const createManager = createAsyncThunk(
  "managers/createManager",
  async ({ subdomain, managerData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/saas/managers/?schema=${subdomain}`,
        managerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create manager"
      );
    }
  }
);

export const updateManager = createAsyncThunk(
  "managers/updateManager",
  async ({ subdomain, id, managerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/saas/updatemanagers/${id}/?schema=${subdomain}`,
        managerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update manager"
      );
    }
  }
);

export const deleteManager = createAsyncThunk(
  "managers/deleteManager",
  async ({ subdomain, id }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/saas/managers/${id}/?schema=${subdomain}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete manager"
      );
    }
  }
);

export const getManagerById = createAsyncThunk(
  "managers/getManagerById",
  async ({ subdomain, id }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/saas/managers/${id}/?schema=${subdomain}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get manager");
    }
  }
);

const initialState = {
  managers: [],
  currentManager: null,
  loading: false,
  error: null,
  success: null,
};

const managersSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentManager: (state, action) => {
      state.currentManager = action.payload;
    },
    clearManagers: (state) => {
      state.managers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch managers
      .addCase(fetchManagers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create manager
      .addCase(createManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createManager.fulfilled, (state, action) => {
        state.loading = false;
        state.managers.push(action.payload);
        state.success = "Manager created successfully";
      })
      .addCase(createManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update manager
      .addCase(updateManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateManager.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.managers.findIndex(
          (manager) => manager.id === action.payload.id
        );
        if (index !== -1) {
          state.managers[index] = action.payload;
        }
        state.success = "Manager updated successfully";
      })
      .addCase(updateManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete manager
      .addCase(deleteManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = state.managers.filter(
          (manager) => manager.id !== action.payload
        );
        state.success = "Manager deleted successfully";
      })
      .addCase(deleteManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get manager by ID
      .addCase(getManagerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getManagerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentManager = action.payload;
      })
      .addCase(getManagerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setCurrentManager, clearManagers } =
  managersSlice.actions;
export default managersSlice.reducer;
