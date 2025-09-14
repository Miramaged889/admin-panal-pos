import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchSaasUsers = createAsyncThunk(
  'saasUsers/fetchSaasUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/saas/users/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch SaaS users');
    }
  }
);

export const createSaasUser = createAsyncThunk(
  'saasUsers/createSaasUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/saas/users/', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create SaaS user');
    }
  }
);

export const updateSaasUser = createAsyncThunk(
  'saasUsers/updateSaasUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/saas/users/${id}/`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update SaaS user');
    }
  }
);

export const deleteSaasUser = createAsyncThunk(
  'saasUsers/deleteSaasUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/saas/users/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete SaaS user');
    }
  }
);

export const getSaasUserById = createAsyncThunk(
  'saasUsers/getSaasUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/saas/users/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get SaaS user');
    }
  }
);

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  success: null,
};

const saasUsersSlice = createSlice({
  name: 'saasUsers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch SaaS users
      .addCase(fetchSaasUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaasUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchSaasUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create SaaS user
      .addCase(createSaasUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSaasUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = 'SaaS user created successfully';
      })
      .addCase(createSaasUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update SaaS user
      .addCase(updateSaasUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSaasUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.success = 'SaaS user updated successfully';
      })
      .addCase(updateSaasUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete SaaS user
      .addCase(deleteSaasUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSaasUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.success = 'SaaS user deleted successfully';
      })
      .addCase(deleteSaasUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get SaaS user by ID
      .addCase(getSaasUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaasUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getSaasUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setCurrentUser } = saasUsersSlice.actions;
export default saasUsersSlice.reducer;
