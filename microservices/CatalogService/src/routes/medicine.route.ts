import express from 'express';
import * as MedicineController from '../controllers/medicine.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'staff', 'customer'), MedicineController.getAllMedicines);
router.get('/search', authorizeRoles('admin', 'staff', 'customer'), MedicineController.searchMedicines);
router.get('/:id', authorizeRoles('admin', 'staff', 'customer'), MedicineController.getMedicineById);
router.post('/', authorizeRoles('admin'), MedicineController.createMedicine);
router.put('/:id', authorizeRoles('admin'), MedicineController.updateMedicine);
router.delete('/:id', authorizeRoles('admin'), MedicineController.deleteMedicine);

export default router;
