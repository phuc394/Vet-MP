import express from 'express';
import * as MedicineInventoryController from '../controllers/medicine-inventory.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);
router.use(authorizeRoles('admin'));

router.get('/', MedicineInventoryController.getAllMedicineInventory);
router.get('/search', MedicineInventoryController.searchMedicineInventory);
router.get('/:id', MedicineInventoryController.getMedicineInventoryById);
router.post('/', MedicineInventoryController.createMedicineInventory);
router.put('/:id', MedicineInventoryController.updateMedicineInventory);
router.delete('/:id', MedicineInventoryController.deleteMedicineInventory);

export default router;
