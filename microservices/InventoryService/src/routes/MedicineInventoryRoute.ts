import express from 'express';
import * as MedicineInventoryController from '../controllers/MedicineInventoryController';

const router = express.Router();

router.get('/', MedicineInventoryController.getAllMedicineInventory);
router.get('/search', MedicineInventoryController.searchMedicineInventory);
router.get('/low-stock', MedicineInventoryController.getLowStockItems);
router.get('/:id', MedicineInventoryController.getMedicineInventoryById);
router.get('/medicine/:medicineId', MedicineInventoryController.getMedicineInventoryByMedicineId);
router.post('/', MedicineInventoryController.createMedicineInventory);
router.put('/:id', MedicineInventoryController.updateMedicineInventory);
router.put('/medicine/:medicineId', MedicineInventoryController.updateMedicineInventoryByMedicineId);
router.delete('/:id', MedicineInventoryController.deleteMedicineInventory);

export default router;
