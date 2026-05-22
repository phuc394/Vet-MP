import connection from '../config/database.config';
import {
    CreateInventoryTransactionRequest,
    InventoryTransaction,
    InventoryTransactionSearchFilters,
    InventoryTransactionSortQuery,
    SortOrder,
    TransactionType,
    UpdateInventoryTransactionRequest
} from '../models/inventory-transaction.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = [
    'transaction_id',
    'medicine_id',
    'transaction_type',
    'quantity',
    'transaction_date',
    'supplier_id',
    'reference_id',
    'created_by',
    'created_at'
];

const DATE_FIELDS = ['transaction_date', 'created_at'];
const DEFAULT_SORT_BY = 'transaction_date';

function resolveSort(query?: InventoryTransactionSortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
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

async function getAllInventoryTransactions(sortQuery?: InventoryTransactionSortQuery): Promise<InventoryTransaction[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Inventory_Transaction ORDER BY ${sortBy} ${order}`);
    return rows as InventoryTransaction[];
}

async function getInventoryTransactionById(id: number): Promise<InventoryTransaction | null> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_id = ?', [id]);
    const transactions = rows as InventoryTransaction[];
    return transactions.length > 0 ? transactions[0] ?? null : null;
}

async function createInventoryTransaction(
    transactionData: CreateInventoryTransactionRequest
): Promise<InventoryTransaction> {
    const transaction: Omit<InventoryTransaction, 'transaction_id'> = {
        medicine_id: transactionData.medicine_id,
        transaction_type: transactionData.transaction_type,
        quantity: transactionData.quantity,
        transaction_date: transactionData.transaction_date,
        created_by: transactionData.created_by,
        created_at: new Date()
    };

    if (transactionData.supplier_id !== undefined) {
        transaction.supplier_id = transactionData.supplier_id;
    }

    if (transactionData.reference_id !== undefined) {
        transaction.reference_id = transactionData.reference_id;
    }

    if (transactionData.notes !== undefined) {
        transaction.notes = transactionData.notes;
    }

    const [result] = await connection.query('INSERT INTO Inventory_Transaction SET ?', [transaction]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...transaction, transaction_id: insertId };
}

async function updateInventoryTransaction(
    id: number,
    transactionData: UpdateInventoryTransactionRequest
): Promise<InventoryTransaction | null> {
    const updateData = Object.fromEntries(Object.entries(transactionData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData
    };

    const [result] = await connection.query('UPDATE Inventory_Transaction SET ? WHERE transaction_id = ?', [
        payload,
        id
    ]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getInventoryTransactionById(id);
}

async function deleteInventoryTransaction(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Inventory_Transaction WHERE transaction_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchInventoryTransactions(filters: InventoryTransactionSearchFilters): Promise<InventoryTransaction[]> {
    let sql = 'SELECT * FROM Inventory_Transaction WHERE 1=1';
    const params: Array<number | string | Date> = [];

    if (filters.medicineId !== undefined) {
        sql += ' AND medicine_id = ?';
        params.push(filters.medicineId);
    }

    if (filters.supplierId !== undefined) {
        sql += ' AND supplier_id = ?';
        params.push(filters.supplierId);
    }

    if (filters.transactionType) {
        sql += ' AND transaction_type = ?';
        params.push(filters.transactionType);
    }

    if (filters.startDate && filters.endDate) {
        sql += ' AND transaction_date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
        sql += ' AND transaction_date >= ?';
        params.push(filters.startDate);
    } else if (filters.endDate) {
        sql += ' AND transaction_date <= ?';
        params.push(filters.endDate);
    }

    if (filters.createdBy !== undefined) {
        sql += ' AND created_by = ?';
        params.push(filters.createdBy);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as InventoryTransaction[];
}

const VALID_TRANSACTION_TYPES: TransactionType[] = [
    TransactionType.IMPORT,
    TransactionType.EXPORT_PRESCRIPTION,
    TransactionType.ADJUSTMENT
];

function resolveTransactionType(value: string): TransactionType {
    if (!VALID_TRANSACTION_TYPES.includes(value as TransactionType)) {
        throw new HttpError(400, `transaction_type must be one of: ${VALID_TRANSACTION_TYPES.join(', ')}`);
    }
    return value as TransactionType;
}

export {
    getAllInventoryTransactions,
    getInventoryTransactionById,
    createInventoryTransaction,
    updateInventoryTransaction,
    deleteInventoryTransaction,
    searchInventoryTransactions,
    resolveTransactionType
};
