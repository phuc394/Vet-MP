export interface Prescription {
    prescription_id?: number;
    record_id: number;
    medicine_id: number;
    quantity: number;
    dosage?: string;
    usage_instructions?: string;
    notes?: string;
    created_at?: Date;
}

export interface CreatePrescriptionRequest {
    record_id: number;
    medicine_id: number;
    quantity: number;
    dosage?: string;
    usage_instructions?: string;
    notes?: string;
}

export interface UpdatePrescriptionRequest {
    medicine_id?: number;
    quantity?: number;
    dosage?: string;
    usage_instructions?: string;
    notes?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface PrescriptionSortQuery {
    sortBy?: string;
    order?: SortOrder;
}

export interface PrescriptionSearchQuery {
    recordId?: string;
    medicineId?: string;
    dosage?: string;
    usageInstructions?: string;
}

export interface PrescriptionSearchFilters {
    recordId?: number;
    medicineId?: number;
    dosage?: string;
    usageInstructions?: string;
}
