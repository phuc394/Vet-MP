import express from 'express';
import * as MedicalRecordController from '../controllers/medical-record.controller';

const router = express.Router();

router.get('/', MedicalRecordController.getAllMedicalRecords);
router.get('/search', MedicalRecordController.searchMedicalRecords);
router.get('/:id', MedicalRecordController.getMedicalRecordById);
router.post('/', MedicalRecordController.createMedicalRecord);
router.put('/:id', MedicalRecordController.updateMedicalRecord);
router.delete('/:id', MedicalRecordController.deleteMedicalRecord);

export default router;
