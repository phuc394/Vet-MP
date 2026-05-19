import connection from '../config/database';
import { Medicine, CreateMedicineRequest, UpdateMedicineRequest } from '../models/MedicineModel';

async function getAllMedicines(): Promise<Medicine[]> {
    const [rows] = await connection.query('SELECT * FROM Medicine');
    return rows as Medicine[];
}

async function getMedicineById(id: number): Promise<Medicine | null> {
    const [rows] = await connection.query('SELECT * FROM Medicine WHERE medicine_id = ?', [id]);
    const medicines = rows as Medicine[];
    return medicines.length > 0 ? medicines[0] ?? null : null;
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
    
    const [result] = await connection.query('INSERT INTO Medicine SET ?', medicine);
    const insertId = (result as any).insertId;
    return { ...medicine, medicine_id: insertId };
}

async function updateMedicine(id: number, medicineData: UpdateMedicineRequest): Promise<Medicine | null> {
    const [result] = await connection.query('UPDATE Medicine SET ? WHERE medicine_id = ?', [medicineData, id]);
    if (result.affectedRows === 0) {
        return null;
    }
    
    return getMedicineById(id);
}

async function deleteMedicine(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Medicine WHERE medicine_id = ?', [id]);
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
    
    const [rows] = await connection.query(sql, params);
    return rows as Medicine[];
}

export {
    getAllMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines
};
