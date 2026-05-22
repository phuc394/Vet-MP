import connection from '../config/database.config';
import {
    CreateMedicineInventoryRequest,
    MedicineInventory,
    MedicineInventorySearchFilters,
    MedicineInventorySortQuery,
    SortOrder,
    UpdateMedicineInventoryRequest
} from '../models/medicine-inventory.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = [
    'inventory_id',
    'medicine_id',
    'import_price',
    'available_stock',
    'min_threshold',
    'created_at',
    'updated_at'
];

const DATE_FIELDS = ['created_at', 'updated_at'];
const DEFAULT_SORT_BY = 'created_at';

function resolveSort(query?: MedicineInventorySortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
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

async function getAllMedicineInventory(sortQuery?: MedicineInventorySortQuery): Promise<MedicineInventory[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Medicine_Inventory ORDER BY ${sortBy} ${order}`);
    return rows as MedicineInventory[];
}

async function getMedicineInventoryById(id: number): Promise<MedicineInventory | null> {
    const [rows] = await connection.query('SELECT * FROM Medicine_Inventory WHERE inventory_id = ?', [id]);
    const inventories = rows as MedicineInventory[];
    return inventories.length > 0 ? inventories[0] ?? null : null;
}

async function createMedicineInventory(inventoryData: CreateMedicineInventoryRequest): Promise<MedicineInventory> {
    const inventory: Omit<MedicineInventory, 'inventory_id'> = {
        medicine_id: inventoryData.medicine_id,
        available_stock: inventoryData.available_stock ?? 0,
        min_threshold: inventoryData.min_threshold ?? 5,
        created_at: new Date(),
        updated_at: new Date()
    };

    if (inventoryData.import_price !== undefined) {
        inventory.import_price = inventoryData.import_price;
    }

    const [result] = await connection.query('INSERT INTO Medicine_Inventory SET ?', [inventory]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...inventory, inventory_id: insertId };
}

async function updateMedicineInventory(id: number, inventoryData: UpdateMedicineInventoryRequest): Promise<MedicineInventory | null> {
    const updateData = Object.fromEntries(Object.entries(inventoryData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData,
        updated_at: new Date()
    };

    const [result] = await connection.query('UPDATE Medicine_Inventory SET ? WHERE inventory_id = ?', [payload, id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getMedicineInventoryById(id);
}

async function deleteMedicineInventory(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Medicine_Inventory WHERE inventory_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchMedicineInventory(filters: MedicineInventorySearchFilters): Promise<MedicineInventory[]> {
    let sql = 'SELECT * FROM Medicine_Inventory WHERE 1=1';
    const params: Array<number | boolean> = [];

    if (filters.medicineId !== undefined) {
        sql += ' AND medicine_id = ?';
        params.push(filters.medicineId);
    }

    if (filters.minStock !== undefined) {
        sql += ' AND available_stock >= ?';
        params.push(filters.minStock);
    }

    if (filters.maxStock !== undefined) {
        sql += ' AND available_stock <= ?';
        params.push(filters.maxStock);
    }

    if (filters.belowThreshold) {
        sql += ' AND available_stock <= min_threshold';
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as MedicineInventory[];
}

export {
    getAllMedicineInventory,
    getMedicineInventoryById,
    createMedicineInventory,
    updateMedicineInventory,
    deleteMedicineInventory,
    searchMedicineInventory
};
