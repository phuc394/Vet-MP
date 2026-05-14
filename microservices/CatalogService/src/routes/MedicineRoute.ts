import express from 'express';
import * as MedicineController from '../controllers/MedicineController';

const router = express.Router();

router.get('/', MedicineController.getAllMedicines);
router.get('/search', MedicineController.searchMedicines);
router.get('/:id', MedicineController.getMedicineById);
router.post('/', MedicineController.createMedicine);
router.put('/:id', MedicineController.updateMedicine);
router.delete('/:id', MedicineController.deleteMedicine);

export default router;
