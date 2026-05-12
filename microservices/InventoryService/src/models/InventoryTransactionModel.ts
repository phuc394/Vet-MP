export interface InventoryTransaction {
    transaction_id?: number;
    medicine_id: number;
    transaction_type: 'import' | 'export_prescription' | 'adjustment';
    quantity: number;
    transaction_date: Date;
    supplier_id?: number;
    reference_id?: number;
    created_by: number;
    notes?: string;
    created_at?: Date;
}

export interface CreateInventoryTransactionRequest {
    medicine_id: number;
    transaction_type: 'import' | 'export_prescription' | 'adjustment';
    quantity: number;
    transaction_date: Date;
    supplier_id?: number;
    reference_id?: number;
    created_by: number;
    notes?: string;
}

export interface UpdateInventoryTransactionRequest {
    medicine_id?: number;
    transaction_type?: 'import' | 'export_prescription' | 'adjustment';
    quantity?: number;
    transaction_date?: Date;
    supplier_id?: number;
    reference_id?: number;
    created_by?: number;
    notes?: string;
}

export enum TransactionType {
    IMPORT = 'import',
    EXPORT_PRESCRIPTION = 'export_prescription',
    ADJUSTMENT = 'adjustment'
}
