import connection from '../config/database';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../models/SupplierModel';

async function getAllSuppliers(): Promise<Supplier[]> {
    const [rows] = await connection.query('SELECT * FROM Supplier');
    return rows as Supplier[];
}

async function getSupplierById(id: number): Promise<Supplier | null> {
    const [rows] = await connection.query('SELECT * FROM Supplier WHERE supplier_id = ?', [id]);
    const suppliers = rows as Supplier[];
    return suppliers.length > 0 ? suppliers[0] ?? null : null;
}

async function createSupplier(supplierData: CreateSupplierRequest): Promise<Supplier> {
    const supplier: Omit<Supplier, 'supplier_id'> = {
        name: supplierData.name,
        created_at: new Date(),
        updated_at: new Date()
    };
    
    if (supplierData.contact_info !== undefined) {
        supplier.contact_info = supplierData.contact_info;
    }
    
    if (supplierData.address !== undefined) {
        supplier.address = supplierData.address;
    }
    
    const [result] = await connection.query('INSERT INTO Supplier SET ?', [supplier]);
    const insertId = (result as any).insertId;
    return { ...supplier, supplier_id: insertId };
}

async function updateSupplier(id: number, supplierData: UpdateSupplierRequest): Promise<Supplier | null> {
    const updateData = Object.fromEntries(
        Object.entries(supplierData).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
        return getSupplierById(id);
    }

    const payload = {
        ...updateData,
        updated_at: new Date()
    };
    
    await connection.query('UPDATE Supplier SET ? WHERE supplier_id = ?', [payload, id]);
    
    const updatedSupplier = await getSupplierById(id);
    return updatedSupplier;
}

async function deleteSupplier(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Supplier WHERE supplier_id = ?', [id]);
    return result.affectedRows > 0;
}

export {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
