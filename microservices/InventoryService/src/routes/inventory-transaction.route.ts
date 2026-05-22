import express from 'express';
import * as InventoryTransactionController from '../controllers/inventory-transaction.controller';

const router = express.Router();

router.get('/', InventoryTransactionController.getAllInventoryTransactions);
router.get('/search', InventoryTransactionController.searchInventoryTransactions);
router.get('/:id', InventoryTransactionController.getInventoryTransactionById);
router.post('/', InventoryTransactionController.createInventoryTransaction);
router.put('/:id', InventoryTransactionController.updateInventoryTransaction);
router.delete('/:id', InventoryTransactionController.deleteInventoryTransaction);

export default router;
