import api from '../config/api';
import {
  Appointment,
  AppointmentApiResponse,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../types/appointment.type';

const getAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<AppointmentApiResponse<Appointment>>('/appointments');
  return response.data.data;
};

const getAppointmentById = async (appointmentId: number): Promise<Appointment> => {
  const response = await api.get<AppointmentApiResponse<Appointment>>(`/appointments/${appointmentId}`);
  return response.data.data[0];
};

const createAppointment = async (payload: CreateAppointmentPayload): Promise<Appointment> => {
  const response = await api.post<AppointmentApiResponse<Appointment>>('/appointments', payload);
  return response.data.data[0];
};

const updateAppointment = async (
  appointmentId: number,
  payload: UpdateAppointmentPayload
): Promise<Appointment> => {
  const response = await api.put<AppointmentApiResponse<Appointment>>(
    `/appointments/${appointmentId}`,
    payload
  );
  return response.data.data[0];
};

export default {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
};

