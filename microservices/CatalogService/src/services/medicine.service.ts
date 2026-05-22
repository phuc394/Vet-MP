import connection from '../config/database.config';
import {
    CreateMedicineRequest,
    Medicine,
    MedicineSearchFilters,
    MedicineSortQuery,
    SortOrder,
    UpdateMedicineRequest
} from '../models/medicine.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = [
    'medicine_id',
    'name',
    'unit',
    'selling_price',
    'ingredients',
    'is_active',
    'created_at',
    'updated_at'
];

const DATE_FIELDS = ['created_at', 'updated_at'];
const DEFAULT_SORT_BY = 'created_at';

function resolveSort(query?: MedicineSortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
    const sortByRaw = typeof query?.sortBy === 'string' ? query.sortBy.trim() : '';
    const sortBy = sortByRaw.length > 0 ? sortByRaw : DEFAULT_SORT_BY;

    if (!SORT_FIELDS.includes(sortBy)) {
        throw new HttpError(400, `sortBy must be one of: ${SORT_FIELDS.join(', ')}`);
    }

    const orderRaw = typeof query?.order === 'string' ? query.order.toLowerCase() : '';
    const defaultOrder: SortOrder = DATE_FIELDS.includes(sortBy) ? 'desc' : 'asc';
    const order: SortOrder = orderRaw === 'asc' || orderRaw === 'desc' ? orderRaw : defaultOrder;

    const mode: SortMode = DATE_FIELDS.includes(sortBy)
        ? order === 'desc'
            ? 'Newest'
            : 'Oldest'
        : order === 'asc'
            ? 'A-Z'
            : 'Z-A';

    if (!['A-Z', 'Z-A', 'Newest', 'Oldest'].includes(mode)) {
        throw new HttpError(400, 'Invalid sort mode');
    }

    return { sortBy, order, mode };
}

async function getAllMedicines(sortQuery?: MedicineSortQuery): Promise<Medicine[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Medicine ORDER BY ${sortBy} ${order}`);
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
        is_active: medicineData.is_active,
        created_at: new Date(),
        updated_at: new Date()
    };

    if (medicineData.ingredients !== undefined) {
        medicine.ingredients = medicineData.ingredients;
    }

    const [result] = await connection.query('INSERT INTO Medicine SET ?', [medicine]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...medicine, medicine_id: insertId };
}

async function updateMedicine(id: number, medicineData: UpdateMedicineRequest): Promise<Medicine | null> {
    const updateData = Object.fromEntries(Object.entries(medicineData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData,
        updated_at: new Date()
    };

    const [result] = await connection.query('UPDATE Medicine SET ? WHERE medicine_id = ?', [payload, id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getMedicineById(id);
}

async function deleteMedicine(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Medicine WHERE medicine_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchMedicines(filters: MedicineSearchFilters): Promise<Medicine[]> {
    let sql = 'SELECT * FROM Medicine WHERE 1=1';
    const params: Array<string | number | boolean> = [];

    if (filters.name) {
        sql += ' AND name LIKE ?';
        params.push(`%${filters.name}%`);
    }

    if (filters.ingredients) {
        sql += ' AND ingredients LIKE ?';
        params.push(`%${filters.ingredients}%`);
    }

    if (filters.isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(filters.isActive);
    }

    sql += ' LIMIT 10';
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
