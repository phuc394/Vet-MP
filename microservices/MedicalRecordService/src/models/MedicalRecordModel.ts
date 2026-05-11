export interface MedicalRecord {
    record_id: number;
    appointment_id: number;
    symptoms: string;
    diagnosis: string;
    notes: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMedicalRecordRequest {
    appointment_id: number;
    symptoms: string;
    diagnosis: string;
    notes: string;
    status: string;
}

export interface UpdateMedicalRecordRequest {
    symptoms?: string;
    diagnosis?: string;
    notes?: string;
    status?: string;
}
