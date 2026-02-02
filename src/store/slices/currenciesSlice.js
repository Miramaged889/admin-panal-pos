import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchCurrencies = createAsyncThunk(
  "currencies/fetchCurrencies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/ten/currencies/");
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch currencies",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const createCurrency = createAsyncThunk(
  "currencies/createCurrency",
  async (currencyData, { rejectWithValue }) => {
    try {
      const response = await api.post("/ten/currencies/", currencyData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to create currency",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const updateCurrency = createAsyncThunk(
  "currencies/updateCurrency",
  async ({ id, currencyData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/ten/currencies/${id}/`, currencyData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to update currency",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const deleteCurrency = createAsyncThunk(
  "currencies/deleteCurrency",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/ten/currencies/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete currency",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const initialState = {
  currencies: [],
  loading: false,
  error: null,
  success: null,
};

const currenciesSlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch currencies
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to fetch currencies";
      })
      // Create currency
      .addCase(createCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies.push(action.payload);
        state.success = "Currency created successfully";
      })
      .addCase(createCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to create currency";
      })
      // Update currency
      .addCase(updateCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currencies.findIndex(
          (currency) => currency.id === action.payload.id
        );
        if (index !== -1) {
          state.currencies[index] = action.payload;
        }
        state.success = "Currency updated successfully";
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to update currency";
      })
      // Delete currency
      .addCase(deleteCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = state.currencies.filter(
          (currency) => currency.id !== action.payload
        );
        state.success = "Currency deleted successfully";
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to delete currency";
      });
  },
});

export const { clearError, clearSuccess } = currenciesSlice.actions;
export default currenciesSlice.reducer;

