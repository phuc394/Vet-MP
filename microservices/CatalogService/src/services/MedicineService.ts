const connection = require('../config/database');
import { Medicine, CreateMedicineRequest, UpdateMedicineRequest } from '../models/MedicineModel';

async function getAllMedicines(): Promise<Medicine[]> {
    const results = await connection.query('SELECT * FROM Medicine');
    return results;
}

async function getMedicineById(id: number): Promise<Medicine | null> {
    const results = await connection.query('SELECT * FROM Medicine WHERE medicine_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
}

async function createMedicine(medicineData: CreateMedicineRequest): Promise<Medicine> {
    const medicine: Omit<Medicine, 'medicine_id'> = {
        name: medicineData.name,
        unit: medicineData.unit,
        selling_price: medicineData.selling_price,
        ingredients: medicineData.ingredients,
        is_active: medicineData.is_active,
        created_at: new Date(),
        updated_at: new Date()
    };
    
    const result = await connection.query('INSERT INTO Medicine SET ?', medicine);
    return { ...medicine, medicine_id: result.insertId };
}

async function updateMedicine(id: number, medicineData: UpdateMedicineRequest): Promise<Medicine | null> {
    const result = await connection.query('UPDATE Medicine SET ? WHERE medicine_id = ?', [medicineData, id]);
    if (result.affectedRows === 0) {
        return null;
    }
    
    return getMedicineById(id);
}

async function deleteMedicine(id: number): Promise<boolean> {
    const result = await connection.query('DELETE FROM Medicine WHERE medicine_id = ?', [id]);
    return result.affectedRows > 0;
}

async function searchMedicines(query?: string, ingredients?: string): Promise<Medicine[]> {
    let sql = 'SELECT * FROM Medicine WHERE is_active = true';
    const params: any[] = [];
    
    if (query) {
        sql += ' AND name LIKE ?';
        params.push(`%${query}%`);
    }
    
    if (ingredients) {
        sql += ' AND ingredients LIKE ?';
        params.push(`%${ingredients}%`);
    }
    
    const results = await connection.query(sql, params);
    return results;
}

export {
    getAllMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines
};