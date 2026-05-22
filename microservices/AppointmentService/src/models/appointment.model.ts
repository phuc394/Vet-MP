export interface Appointment {
    appointment_id?: number;
    pet_id: number;
    service_id: number;
    staff_id?: number;
    appointment_date: Date;
    start_time: Date;
    end_time: Date;
    status: AppointmentStatus;
    cancellation_reason?: string;
    service_price: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateAppointmentRequest {
    pet_id: number;
    service_id: number;
    staff_id?: number;
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
    status?: AppointmentStatus;
    cancellation_reason?: string;
    service_price?: number;
}

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

export type SortOrder = 'asc' | 'desc';

export interface AppointmentSortQuery {
    sortBy?: string;
    order?: SortOrder;
}

export interface AppointmentSearchQuery {
    status?: string;
    startDate?: string;
    endDate?: string;
    petId?: string;
    staffId?: string;
}

export interface AppointmentSearchFilters {
    status?: AppointmentStatus;
    startDate?: Date;
    endDate?: Date;
    petId?: number;
    staffId?: number;
}
