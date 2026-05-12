const connection = require('../config/database');
import { InventoryTransaction, CreateInventoryTransactionRequest, UpdateInventoryTransactionRequest, TransactionType } from '../models/InventoryTransactionModel';

async function getAllInventoryTransactions(): Promise<InventoryTransaction[]> {
    const results = await connection.query('SELECT * FROM Inventory_Transaction ORDER BY transaction_date DESC');
    return results;
}

async function getInventoryTransactionById(id: number): Promise<InventoryTransaction | null> {
    const results = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
}

async function getTransactionsByMedicineId(medicineId: number): Promise<InventoryTransaction[]> {
    const results = await connection.query('SELECT * FROM Inventory_Transaction WHERE medicine_id = ? ORDER BY transaction_date DESC', [medicineId]);
    return results;
}

async function getTransactionsBySupplierId(supplierId: number): Promise<InventoryTransaction[]> {
    const results = await connection.query('SELECT * FROM Inventory_Transaction WHERE supplier_id = ? ORDER BY transaction_date DESC', [supplierId]);
    return results;
}

async function getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<InventoryTransaction[]> {
    const results = await connection.query(
        'SELECT * FROM Inventory_Transaction WHERE transaction_date BETWEEN ? AND ? ORDER BY transaction_date DESC',
        [startDate, endDate]
    );
    return results;
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
    
    const results = await connection.query('INSERT INTO Inventory_Transaction SET ?', [transaction]);
    return { ...transaction, transaction_id: results.insertId };
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
    const results = await connection.query('DELETE FROM Inventory_Transaction WHERE transaction_id = ?', [id]);
    return results.affectedRows > 0;
}

async function getImportTransactions(): Promise<InventoryTransaction[]> {
    const results = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_type = ? ORDER BY transaction_date DESC', [TransactionType.IMPORT]);
    return results;
}

async function getExportTransactions(): Promise<InventoryTransaction[]> {
    const results = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_type = ? ORDER BY transaction_date DESC', [TransactionType.EXPORT_PRESCRIPTION]);
    return results;
}

async function getAdjustmentTransactions(): Promise<InventoryTransaction[]> {
    const results = await connection.query('SELECT * FROM Inventory_Transaction WHERE transaction_type = ? ORDER BY transaction_date DESC', [TransactionType.ADJUSTMENT]);
    return results;
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
