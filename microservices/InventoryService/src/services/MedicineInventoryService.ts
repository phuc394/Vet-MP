import connection from '../config/database';
import { MedicineInventory, CreateMedicineInventoryRequest, UpdateMedicineInventoryRequest } from '../models/MedicineInventoryModel';

async function getAllMedicineInventory(): Promise<MedicineInventory[]> {
    const [rows] = await connection.query('SELECT * FROM Medicine_Inventory');
    return rows as MedicineInventory[];
}

async function getMedicineInventoryById(id: number): Promise<MedicineInventory | null> {
    const [rows] = await connection.query('SELECT * FROM Medicine_Inventory WHERE inventory_id = ?', [id]);
    const inventories = rows as MedicineInventory[];
    return inventories.length > 0 ? inventories[0] ?? null : null;
}

async function getMedicineInventoryByMedicineId(medicineId: number): Promise<MedicineInventory | null> {
    const [rows] = await connection.query('SELECT * FROM Medicine_Inventory WHERE medicine_id = ?', [medicineId]);
    const inventories = rows as MedicineInventory[];
    return inventories.length > 0 ? inventories[0] ?? null : null;
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
    
    const [result] = await connection.query('INSERT INTO Medicine_Inventory SET ?', [inventory]);
    const insertId = (result as any).insertId;
    return { ...inventory, inventory_id: insertId };
}

async function updateMedicineInventory(id: number, inventoryData: UpdateMedicineInventoryRequest): Promise<MedicineInventory | null> {
    const updateData = Object.fromEntries(
        Object.entries(inventoryData).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
        return getMedicineInventoryById(id);
    }

    const payload = {
        ...updateData,
        updated_at: new Date()
    };
    
    await connection.query('UPDATE Medicine_Inventory SET ? WHERE inventory_id = ?', [payload, id]);
    
    const updatedInventory = await getMedicineInventoryById(id);
    return updatedInventory;
}

async function updateMedicineInventoryByMedicineId(medicineId: number, inventoryData: UpdateMedicineInventoryRequest): Promise<MedicineInventory | null> {
    const updateData = Object.fromEntries(
        Object.entries(inventoryData).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
        return getMedicineInventoryByMedicineId(medicineId);
    }

    const payload = {
        ...updateData,
        updated_at: new Date()
    };
    
    await connection.query('UPDATE Medicine_Inventory SET ? WHERE medicine_id = ?', [payload, medicineId]);
    
    const updatedInventory = await getMedicineInventoryByMedicineId(medicineId);
    return updatedInventory;
}

async function deleteMedicineInventory(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Medicine_Inventory WHERE inventory_id = ?', [id]);
    return result.affectedRows > 0;
}

async function getLowStockItems(): Promise<MedicineInventory[]> {
    const [rows] = await connection.query('SELECT * FROM Medicine_Inventory WHERE available_stock <= min_threshold');
    return rows as MedicineInventory[];
}

async function searchMedicineInventory(query?: string, lowStock?: boolean): Promise<MedicineInventory[]> {
    let sql = 'SELECT mi.* FROM Medicine_Inventory mi';
    const params: any[] = [];
    
    if (query) {
        sql += ' JOIN Medicine m ON mi.medicine_id = m.medicine_id WHERE m.name LIKE ?';
        params.push(`%${query}%`);
    }
    
    if (lowStock) {
        sql += query ? ' AND mi.available_stock <= mi.min_threshold' : ' WHERE mi.available_stock <= mi.min_threshold';
    }
    
    const [rows] = await connection.query(sql, params);
    return rows as MedicineInventory[];
}

export {
    getAllMedicineInventory,
    getMedicineInventoryById,
    getMedicineInventoryByMedicineId,
    createMedicineInventory,
    updateMedicineInventory,
    updateMedicineInventoryByMedicineId,
    deleteMedicineInventory,
    getLowStockItems,
    searchMedicineInventory
};
