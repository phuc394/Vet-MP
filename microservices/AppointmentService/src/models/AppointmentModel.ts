export interface Appointment {
    appointment_id?: number;
    pet_id: number;
    service_id: number;
    staff_id: number;
    appointment_date: Date;
    start_time: Date;
    end_time: Date;
    status: string;
    cancellation_reason?: string;
    service_price: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateAppointmentRequest {
    pet_id: number;
    service_id: number;
    staff_id: number;
    appointment_date: Date;
    start_time: Date;
    end_time: Date;
    service_price: number;
}

export interface UpdateAppointmentRequest {
    pet_id?: number;
    service_id?: number;
    staff_id?: number;
    appointment_date?: Date;
    start_time?: Date;
    end_time?: Date;
    status?: string;
    cancellation_reason?: string;
    service_price?: number;
}

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

