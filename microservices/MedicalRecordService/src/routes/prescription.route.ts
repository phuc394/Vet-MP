import express from 'express';
import * as PrescriptionController from '../controllers/prescription.controller';

const router = express.Router();

router.get('/', PrescriptionController.getAllPrescriptions);
router.get('/search', PrescriptionController.searchPrescriptions);
router.get('/:id', PrescriptionController.getPrescriptionById);
router.post('/', PrescriptionController.createPrescription);
router.put('/:id', PrescriptionController.updatePrescription);
router.delete('/:id', PrescriptionController.deletePrescription);

export default router;
