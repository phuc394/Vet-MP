import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import appointmentService from '../../services/appointment.service';
import {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../types/appointment.type';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  detailLoading: boolean;
  creating: boolean;
  updating: boolean;
  error: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  detailLoading: false,
  creating: false,
  updating: false,
  error: null,
  detailError: null,
  createError: null,
  updateError: null,
};

export const fetchAppointmentsThunk = createAsyncThunk(
  'appointment/fetchAppointments',
  async (_, thunkAPI) => {
    try {
      return await appointmentService.getAppointments();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Get appointments failed'
      );
    }
  }
);

export const fetchAppointmentByIdThunk = createAsyncThunk(
  'appointment/fetchAppointmentById',
  async (appointmentId: number, thunkAPI) => {
    try {
      return await appointmentService.getAppointmentById(appointmentId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Get appointment detail failed'
      );
    }
  }
);

export const createAppointmentThunk = createAsyncThunk(
  'appointment/createAppointment',
  async (payload: CreateAppointmentPayload, thunkAPI) => {
    try {
      return await appointmentService.createAppointment(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Create appointment failed'
      );
    }
  }
);

export const updateAppointmentThunk = createAsyncThunk(
  'appointment/updateAppointment',
  async (
    { appointmentId, payload }: { appointmentId: number; payload: UpdateAppointmentPayload },
    thunkAPI
  ) => {
    try {
      return await appointmentService.updateAppointment(appointmentId, payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Update appointment failed'
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
      state.detailError = null;
      state.createError = null;
      state.updateError = null;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearAppointmentData: (state) => {
      state.appointments = [];
      state.selectedAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAppointmentByIdThunk.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAppointmentByIdThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedAppointment = action.payload;
        state.appointments = state.appointments.map((appointment) =>
          appointment.appointment_id === action.payload.appointment_id ? action.payload : appointment
        );
      })
      .addCase(fetchAppointmentByIdThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      })
      .addCase(createAppointmentThunk.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createAppointmentThunk.fulfilled, (state, action) => {
        state.creating = false;
        state.selectedAppointment = action.payload;
        state.appointments = [action.payload, ...state.appointments];
      })
      .addCase(createAppointmentThunk.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
      })
      .addCase(updateAppointmentThunk.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.selectedAppointment = action.payload;
        state.appointments = state.appointments.map((appointment) =>
          appointment.appointment_id === action.payload.appointment_id ? action.payload : appointment
        );
      })
      .addCase(updateAppointmentThunk.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });
  },
});

export const {
  clearAppointmentError,
  clearAppointmentData,
  setSelectedAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;

