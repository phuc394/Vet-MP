export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  appointment_id: number;
  pet_id: number;
  service_id: number;
  staff_id?: number | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  cancellation_reason?: string | null;
  service_price: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAppointmentPayload {
  pet_id: number;
  service_id: number;
  staff_id?: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  service_price: number;
}

export interface UpdateAppointmentPayload {
  pet_id?: number;
  service_id?: number;
  staff_id?: number;
  appointment_date?: string;
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatus;
  cancellation_reason?: string;
  service_price?: number;
}

export interface AppointmentApiResponse<T> {
  status: number;
  message: string;
  data: T[];
}

