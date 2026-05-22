import express from 'express';
import * as SupplierController from '../controllers/supplier.controller';

const router = express.Router();

router.get('/', SupplierController.getAllSuppliers);
router.get('/search', SupplierController.searchSuppliers);
router.get('/:id', SupplierController.getSupplierById);
router.post('/', SupplierController.createSupplier);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

export default router;
