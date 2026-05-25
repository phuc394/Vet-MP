import express from 'express';
import * as SupplierController from '../controllers/supplier.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);
router.use(authorizeRoles('admin'));

router.get('/', SupplierController.getAllSuppliers);
router.get('/search', SupplierController.searchSuppliers);
router.get('/:id', SupplierController.getSupplierById);
router.post('/', SupplierController.createSupplier);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

export default router;
