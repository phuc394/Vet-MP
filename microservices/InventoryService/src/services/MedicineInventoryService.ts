const connection = require('../config/database');
import { MedicineInventory, CreateMedicineInventoryRequest, UpdateMedicineInventoryRequest } from '../models/MedicineInventoryModel';

async function getAllMedicineInventory(): Promise<MedicineInventory[]> {
    const results = await connection.query('SELECT * FROM Medicine_Inventory');
    return results;
}

async function getMedicineInventoryById(id: number): Promise<MedicineInventory | null> {
    const results = await connection.query('SELECT * FROM Medicine_Inventory WHERE inventory_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
}

async function getMedicineInventoryByMedicineId(medicineId: number): Promise<MedicineInventory | null> {
    const results = await connection.query('SELECT * FROM Medicine_Inventory WHERE medicine_id = ?', [medicineId]);
    return results.length > 0 ? results[0] : null;
}

async function createMedicineInventory(inventoryData: CreateMedicineInventoryRequest): Promise<MedicineInventory> {
    const inventory: Omit<MedicineInventory, 'inventory_id'> = {
        medicine_id: inventoryData.medicine_id,
        available_stock: inventoryData.available_stock || 0,
        min_threshold: inventoryData.min_threshold || 5,
        created_at: new Date(),
        updated_at: new Date()
    };
    
    if (inventoryData.import_price !== undefined) {
        inventory.import_price = inventoryData.import_price;
    }
    
    const results = await connection.query('INSERT INTO Medicine_Inventory SET ?', [inventory]);
    return { ...inventory, inventory_id: results.insertId };
}

async function updateMedicineInventory(id: number, inventoryData: UpdateMedicineInventoryRequest): Promise<MedicineInventory | null> {
    const updateData = {
        ...inventoryData,
        updated_at: new Date()
    };
    
    await connection.query('UPDATE Medicine_Inventory SET ? WHERE inventory_id = ?', [updateData, id]);
    
    const updatedInventory = await getMedicineInventoryById(id);
    return updatedInventory;
}

async function updateMedicineInventoryByMedicineId(medicineId: number, inventoryData: UpdateMedicineInventoryRequest): Promise<MedicineInventory | null> {
    const updateData = {
        ...inventoryData,
        updated_at: new Date()
    };
    
    await connection.query('UPDATE Medicine_Inventory SET ? WHERE medicine_id = ?', [updateData, medicineId]);
    
    const updatedInventory = await getMedicineInventoryByMedicineId(medicineId);
    return updatedInventory;
}

async function deleteMedicineInventory(id: number): Promise<boolean> {
    const results = await connection.query('DELETE FROM Medicine_Inventory WHERE inventory_id = ?', [id]);
    return results.affectedRows > 0;
}

async function getLowStockItems(): Promise<MedicineInventory[]> {
    const results = await connection.query('SELECT * FROM Medicine_Inventory WHERE available_stock <= min_threshold');
    return results;
}

export {
    getAllMedicineInventory,
    getMedicineInventoryById,
    getMedicineInventoryByMedicineId,
    createMedicineInventory,
    updateMedicineInventory,
    updateMedicineInventoryByMedicineId,
    deleteMedicineInventory,
    getLowStockItems
};
