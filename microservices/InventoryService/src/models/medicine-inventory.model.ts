export interface MedicineInventory {
    inventory_id?: number;
    medicine_id: number;
    import_price?: number;
    available_stock: number;
    min_threshold: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateMedicineInventoryRequest {
    medicine_id: number;
    import_price?: number;
    available_stock?: number;
    min_threshold?: number;
}

export interface UpdateMedicineInventoryRequest {
    import_price?: number;
    available_stock?: number;
    min_threshold?: number;
}

export type SortOrder = 'asc' | 'desc';

export interface MedicineInventorySortQuery {
    sortBy?: string;
    order?: SortOrder;
}

export interface MedicineInventorySearchQuery {
    medicineId?: string;
    minStock?: string;
    maxStock?: string;
    belowThreshold?: string;
}

export interface MedicineInventorySearchFilters {
    medicineId?: number;
    minStock?: number;
    maxStock?: number;
    belowThreshold?: boolean;
}
