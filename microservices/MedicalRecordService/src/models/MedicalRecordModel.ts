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

export interface Prescription {
    prescription_id: number;
    record_id: number;
    medicine_id: number;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePrescriptionRequest {
    record_id: number;
    medicine_id: number;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
}

export interface UpdatePrescriptionRequest {
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
}

export interface ReExamination {
    re_exam_id: number;
    record_id: number;
    suggested_date: Date;
    reason: string;
    is_booked: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateReExaminationRequest {
    record_id: number;
    suggested_date: Date;
    reason: string;
    is_booked: boolean;
}

export interface UpdateReExaminationRequest {
    suggested_date?: Date;
    reason?: string;
    is_booked?: boolean;
}

