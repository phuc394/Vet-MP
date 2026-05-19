import * as InventoryTransactionService from '../services/InventoryTransactionService';

async function getAllInventoryTransactions(_req: any, res: any) {
    try {
        const transactions = await InventoryTransactionService.getAllInventoryTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getInventoryTransactionById(req: any, res: any) {
    try {
        const { id } = req.params;
        const transaction = await InventoryTransactionService.getInventoryTransactionById(Number(id));
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getTransactionsByMedicineId(req: any, res: any) {
    try {
        const { medicineId } = req.params;
        const transactions = await InventoryTransactionService.getTransactionsByMedicineId(Number(medicineId));
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getTransactionsBySupplierId(req: any, res: any) {
    try {
        const { supplierId } = req.params;
        const transactions = await InventoryTransactionService.getTransactionsBySupplierId(Number(supplierId));
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getTransactionsByDateRange(req: any, res: any) {
    try {
        const { startDate, endDate } = req.params;
        const transactions = await InventoryTransactionService.getTransactionsByDateRange(startDate, endDate);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createInventoryTransaction(req: any, res: any) {
    try {
        const { medicine_id, transaction_type, quantity, transaction_date, supplier_id, reference_id, created_by, notes } = req.body;
        const result = await InventoryTransactionService.createInventoryTransaction({ 
            medicine_id, 
            transaction_type, 
            quantity, 
            transaction_date, 
            supplier_id, 
            reference_id, 
            created_by, 
            notes 
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateInventoryTransaction(req: any, res: any) {
    try {
        const { id } = req.params;
        const { medicine_id, transaction_type, quantity, transaction_date, supplier_id, reference_id, created_by, notes } = req.body;
        const result = await InventoryTransactionService.updateInventoryTransaction(Number(id), { 
            medicine_id, 
            transaction_type, 
            quantity, 
            transaction_date, 
            supplier_id, 
            reference_id, 
            created_by, 
            notes 
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteInventoryTransaction(req: any, res: any) {
    try {
        const { id } = req.params;
        const result = await InventoryTransactionService.deleteInventoryTransaction(Number(id));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getImportTransactions(_req: any, res: any) {
    try {
        const transactions = await InventoryTransactionService.getImportTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getExportTransactions(_req: any, res: any) {
    try {
        const transactions = await InventoryTransactionService.getExportTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAdjustmentTransactions(_req: any, res: any) {
    try {
        const transactions = await InventoryTransactionService.getAdjustmentTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
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
