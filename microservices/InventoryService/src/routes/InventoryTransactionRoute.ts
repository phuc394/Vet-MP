import express from 'express';
import * as InventoryTransactionController from '../controllers/InventoryTransactionController';

const router = express.Router();

router.get('/', InventoryTransactionController.getAllInventoryTransactions);
router.get('/import', InventoryTransactionController.getImportTransactions);
router.get('/export', InventoryTransactionController.getExportTransactions);
router.get('/adjustment', InventoryTransactionController.getAdjustmentTransactions);
router.get('/medicine/:medicineId', InventoryTransactionController.getTransactionsByMedicineId);
router.get('/supplier/:supplierId', InventoryTransactionController.getTransactionsBySupplierId);
router.get('/date-range/:startDate/:endDate', InventoryTransactionController.getTransactionsByDateRange);
router.get('/:id', InventoryTransactionController.getInventoryTransactionById);
router.post('/', InventoryTransactionController.createInventoryTransaction);
router.put('/:id', InventoryTransactionController.updateInventoryTransaction);
router.delete('/:id', InventoryTransactionController.deleteInventoryTransaction);

export default router;
