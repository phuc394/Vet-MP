import express from 'express';
import * as MedicineInventoryController from '../controllers/medicine-inventory.controller';

const router = express.Router();

router.get('/', MedicineInventoryController.getAllMedicineInventory);
router.get('/search', MedicineInventoryController.searchMedicineInventory);
router.get('/:id', MedicineInventoryController.getMedicineInventoryById);
router.post('/', MedicineInventoryController.createMedicineInventory);
router.put('/:id', MedicineInventoryController.updateMedicineInventory);
router.delete('/:id', MedicineInventoryController.deleteMedicineInventory);

export default router;
