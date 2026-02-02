import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchMeasureUnits = createAsyncThunk(
  "measureUnits/fetchMeasureUnits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/ten/measure-units/");
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch measure units",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const createMeasureUnit = createAsyncThunk(
  "measureUnits/createMeasureUnit",
  async (measureUnitData, { rejectWithValue }) => {
    try {
      const response = await api.post("/ten/measure-units/", measureUnitData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to create measure unit",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const updateMeasureUnit = createAsyncThunk(
  "measureUnits/updateMeasureUnit",
  async ({ id, measureUnitData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/ten/measure-units/${id}/`, measureUnitData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to update measure unit",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const deleteMeasureUnit = createAsyncThunk(
  "measureUnits/deleteMeasureUnit",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/ten/measure-units/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete measure unit",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const initialState = {
  measureUnits: [],
  loading: false,
  error: null,
  success: null,
};

const measureUnitsSlice = createSlice({
  name: "measureUnits",
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
      // Fetch measure units
      .addCase(fetchMeasureUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeasureUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.measureUnits = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMeasureUnits.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to fetch measure units";
      })
      // Create measure unit
      .addCase(createMeasureUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeasureUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.measureUnits.push(action.payload);
        state.success = "Measure unit created successfully";
      })
      .addCase(createMeasureUnit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to create measure unit";
      })
      // Update measure unit
      .addCase(updateMeasureUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMeasureUnit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.measureUnits.findIndex(
          (unit) => unit.id === action.payload.id
        );
        if (index !== -1) {
          state.measureUnits[index] = action.payload;
        }
        state.success = "Measure unit updated successfully";
      })
      .addCase(updateMeasureUnit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to update measure unit";
      })
      // Delete measure unit
      .addCase(deleteMeasureUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeasureUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.measureUnits = state.measureUnits.filter(
          (unit) => unit.id !== action.payload
        );
        state.success = "Measure unit deleted successfully";
      })
      .addCase(deleteMeasureUnit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to delete measure unit";
      });
  },
});

export const { clearError, clearSuccess } = measureUnitsSlice.actions;
export default measureUnitsSlice.reducer;

