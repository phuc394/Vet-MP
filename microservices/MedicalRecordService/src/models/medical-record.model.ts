export interface MedicalRecord {
    record_id?: number;
    appointment_id: number;
    symptoms?: string;
    diagnosis?: string;
    notes?: string;
    status: MedicalRecordStatus;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateMedicalRecordRequest {
    appointment_id: number;
    symptoms?: string;
    diagnosis?: string;
    notes?: string;
    status?: MedicalRecordStatus;
}

export interface UpdateMedicalRecordRequest {
    symptoms?: string;
    diagnosis?: string;
    notes?: string;
    status?: MedicalRecordStatus;
}

export enum MedicalRecordStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

export type SortOrder = 'asc' | 'desc';

export interface MedicalRecordSortQuery {
    sortBy?: string;
    order?: SortOrder;
}

export interface MedicalRecordSearchQuery {
    appointmentId?: string;
    symptoms?: string;
    diagnosis?: string;
    status?: string;
}

export interface MedicalRecordSearchFilters {
    appointmentId?: number;
    symptoms?: string;
    diagnosis?: string;
    status?: MedicalRecordStatus;
}
