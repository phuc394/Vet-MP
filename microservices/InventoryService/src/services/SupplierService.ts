const connection = require('../config/database');
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../models/SupplierModel';

async function getAllSuppliers(): Promise<Supplier[]> {
    const results = await connection.query('SELECT * FROM Supplier');
    return results;
}

async function getSupplierById(id: number): Promise<Supplier | null> {
    const results = await connection.query('SELECT * FROM Supplier WHERE supplier_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
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
    
    const results = await connection.query('INSERT INTO Supplier SET ?', [supplier]);
    return { ...supplier, supplier_id: results.insertId };
}

async function updateSupplier(id: number, supplierData: UpdateSupplierRequest): Promise<Supplier | null> {
    const updateData = {
        ...supplierData,
        updated_at: new Date()
    };
    
    await connection.query('UPDATE Supplier SET ? WHERE supplier_id = ?', [updateData, id]);
    
    const updatedSupplier = await getSupplierById(id);
    return updatedSupplier;
}

async function deleteSupplier(id: number): Promise<boolean> {
    const results = await connection.query('DELETE FROM Supplier WHERE supplier_id = ?', [id]);
    return results.affectedRows > 0;
}

export {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
