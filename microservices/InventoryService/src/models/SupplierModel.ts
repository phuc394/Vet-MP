export interface Supplier {
    supplier_id?: number;
    name: string;
    contact_info?: string;
    address?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateSupplierRequest {
    name: string;
    contact_info?: string;
    address?: string;
}

export interface UpdateSupplierRequest {
    name?: string;
    contact_info?: string;
    address?: string;
}
