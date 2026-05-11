export interface Medicine {
    medicine_id: number;
    name: string;
    unit: string;
    selling_price: number;
    ingredients: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMedicineRequest {
    name: string;
    unit: string;
    selling_price: number;
    ingredients: string;
    is_active: boolean;
}

export interface UpdateMedicineRequest {
    name?: string;
    unit?: string;
    selling_price?: number;
    ingredients?: string;
    is_active?: boolean;
}

