import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (schema, { rejectWithValue }) => {
    try {
      const url = schema ? `/ten/clients/?schema=${schema}` : "/ten/clients/";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch clients",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const fetchTenants = createAsyncThunk(
  "clients/fetchTenants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/ten/tenants/");
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch tenants",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const createTenant = createAsyncThunk(
  "clients/createTenant",
  async (tenantData, { rejectWithValue }) => {
    try {
      const response = await api.post("/ten/tenants/", tenantData);
      return response.data;
    } catch (error) {
      // Log detailed error information
      if (error.response) {
        console.log(error.response.data);
      }

      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to create tenant",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData, { rejectWithValue }) => {
    try {
      console.log("🚀 Creating client with data:", clientData);
      // Use new endpoint for creating clients
      const response = await api.post("/ten/addclients/", clientData);
      console.log("✅ Client created successfully:", response.data);
      return response.data;
    } catch (error) {
      // Log detailed error information
      if (error.response) {
        console.log(error.response.data);
      }

      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to create client",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const updateTenant = createAsyncThunk(
  "clients/updateTenant",
  async ({ id, tenantData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/ten/tenants/${id}/`, tenantData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update tenant",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, clientData, schema }, { rejectWithValue }) => {
    try {
      // Use new endpoint format for updating clients
      const url = schema
        ? `/ten/updateclients/${id}/?schema=${schema}`
        : `/ten/updateclients/${id}/`;
      const response = await api.put(url, clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update client",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async ({ id, schema }, { rejectWithValue }) => {
    try {
      // Use the same pattern as update for consistency
      const url = schema
        ? `/ten/clients/${id}/?schema=${schema}`
        : `/ten/clients/${id}/`;
      await api.delete(url);
      return id;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete client",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const getClientById = createAsyncThunk(
  "clients/getClientById",
  async ({ id, schema }, { rejectWithValue }) => {
    try {
      // Use consistent pattern with schema parameter
      const url = schema
        ? `/ten/clients/${id}/?schema=${schema}`
        : `/ten/clients/${id}/`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to get client",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const initialState = {
  clients: [],
  tenants: [],
  currentClient: null,
  loading: false,
  error: null,
  success: null,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to fetch clients";
      })
      // Fetch tenants
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        // Check if payload is valid array, if not set empty array
        state.tenants = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to fetch tenants";
      })
      // Create tenant
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state) => {
        state.loading = false;
        state.success = "Tenant created successfully";
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to create tenant";
      })
      // Create client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.push(action.payload);
        state.success = "Client created successfully";
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to create client";
      })
      // Update tenant
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tenants.findIndex(
          (tenant) => tenant.id === action.payload.id
        );
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
        state.success = "Tenant updated successfully";
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to update tenant";
      })
      // Update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(
          (client) => client.id === action.payload.id
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        state.success = "Client updated successfully";
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to update client";
      })
      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter(
          (client) => client.id !== action.payload
        );
        state.success = "Client deleted successfully";
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to delete client";
      })
      // Get client by ID
      .addCase(getClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to get client";
      });
  },
});

export const { clearError, clearSuccess, setCurrentClient } =
  clientsSlice.actions;
export default clientsSlice.reducer;
