import connection from '../config/database.config';
import {
    CreateSupplierRequest,
    SortOrder,
    Supplier,
    SupplierSearchFilters,
    SupplierSortQuery,
    UpdateSupplierRequest
} from '../models/supplier.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = ['supplier_id', 'name', 'contact_info', 'address', 'created_at', 'updated_at'];
const DATE_FIELDS = ['created_at', 'updated_at'];
const DEFAULT_SORT_BY = 'created_at';

function resolveSort(query?: SupplierSortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
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

async function getAllSuppliers(sortQuery?: SupplierSortQuery): Promise<Supplier[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Supplier ORDER BY ${sortBy} ${order}`);
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
    const insertId = (result as { insertId: number }).insertId;
    return { ...supplier, supplier_id: insertId };
}

async function updateSupplier(id: number, supplierData: UpdateSupplierRequest): Promise<Supplier | null> {
    const updateData = Object.fromEntries(Object.entries(supplierData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData,
        updated_at: new Date()
    };

    const [result] = await connection.query('UPDATE Supplier SET ? WHERE supplier_id = ?', [payload, id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getSupplierById(id);
}

async function deleteSupplier(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Supplier WHERE supplier_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchSuppliers(filters: SupplierSearchFilters): Promise<Supplier[]> {
    let sql = 'SELECT * FROM Supplier WHERE 1=1';
    const params: Array<string> = [];

    if (filters.name) {
        sql += ' AND name LIKE ?';
        params.push(`%${filters.name}%`);
    }

    if (filters.contactInfo) {
        sql += ' AND contact_info LIKE ?';
        params.push(`%${filters.contactInfo}%`);
    }

    if (filters.address) {
        sql += ' AND address LIKE ?';
        params.push(`%${filters.address}%`);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as Supplier[];
}

export {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
};
