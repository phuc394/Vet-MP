export interface Medicine {
    medicine_id?: number;
    name: string;
    unit: string;
    selling_price: number;
    ingredients?: string;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateMedicineRequest {
    name: string;
    unit: string;
    selling_price: number;
    ingredients?: string;
    is_active: boolean;
}

export interface UpdateMedicineRequest {
    name?: string;
    unit?: string;
    selling_price?: number;
    ingredients?: string;
    is_active?: boolean;
}

export type SortOrder = 'asc' | 'desc';

export interface MedicineSortQuery {
    sortBy?: string;
    order?: SortOrder;
}

export interface MedicineSearchQuery {
    name?: string;
    ingredients?: string;
    isActive?: string;
}

export interface MedicineSearchFilters {
    name?: string;
    ingredients?: string;
    isActive?: boolean;
}
