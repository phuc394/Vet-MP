import connection from '../config/database';
import { InventoryTransaction, CreateInventoryTransactionRequest, UpdateInventoryTransactionRequest, TransactionType } from '../models/InventoryTransactionModel';

async function getAllInventoryTransactions(): Promise<InventoryTransaction[]> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction ORDER BY transaction_date DESC');
    return rows as InventoryTransaction[];
}

async function getInventoryTransactionById(id: number): Promise<InventoryTransaction | null> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_id = ?', [id]);
    const transactions = rows as InventoryTransaction[];
    return transactions.length > 0 ? transactions[0] ?? null : null;
}

async function getTransactionsByMedicineId(medicineId: number): Promise<InventoryTransaction[]> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction WHERE medicine_id = ? ORDER BY transaction_date DESC', [medicineId]);
    return rows as InventoryTransaction[];
}

async function getTransactionsBySupplierId(supplierId: number): Promise<InventoryTransaction[]> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction WHERE supplier_id = ? ORDER BY transaction_date DESC', [supplierId]);
    return rows as InventoryTransaction[];
}

async function getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<InventoryTransaction[]> {
    const [rows] = await connection.query(
        'SELECT * FROM Inventory_Transaction WHERE transaction_date BETWEEN ? AND ? ORDER BY transaction_date DESC',
        [startDate, endDate]
    );
    return rows as InventoryTransaction[];
}

async function createInventoryTransaction(transactionData: CreateInventoryTransactionRequest): Promise<InventoryTransaction> {
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
    return { ...transaction, transaction_id: result.insertId };
}

async function updateInventoryTransaction(id: number, transactionData: UpdateInventoryTransactionRequest): Promise<InventoryTransaction | null> {
    const updateData = {
        ...transactionData
    };
    
    await connection.query('UPDATE Inventory_Transaction SET ? WHERE transaction_id = ?', [updateData, id]);
    
    const updatedTransaction = await getInventoryTransactionById(id);
    return updatedTransaction;
}

async function deleteInventoryTransaction(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Inventory_Transaction WHERE transaction_id = ?', [id]);
    return result.affectedRows > 0;
}

async function getImportTransactions(): Promise<InventoryTransaction[]> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_type = ? ORDER BY transaction_date DESC', [TransactionType.IMPORT]);
    return rows as InventoryTransaction[];
}

async function getExportTransactions(): Promise<InventoryTransaction[]> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_type = ? ORDER BY transaction_date DESC', [TransactionType.EXPORT_PRESCRIPTION]);
    return rows as InventoryTransaction[];
}

async function getAdjustmentTransactions(): Promise<InventoryTransaction[]> {
    const [rows] = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_type = ? ORDER BY transaction_date DESC', [TransactionType.ADJUSTMENT]);
    return rows as InventoryTransaction[];
}

export {
    getAllInventoryTransactions,
    getInventoryTransactionById,
    getTransactionsByMedicineId,
    getTransactionsBySupplierId,
    getTransactionsByDateRange,
    createInventoryTransaction,
    updateInventoryTransaction,
    deleteInventoryTransaction,
    getImportTransactions,
    getExportTransactions,
    getAdjustmentTransactions
};
