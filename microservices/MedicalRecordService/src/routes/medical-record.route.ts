import express from 'express';
import * as MedicalRecordController from '../controllers/medical-record.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'customer'), MedicalRecordController.getAllMedicalRecords);
router.get('/search', authorizeRoles('admin', 'customer'), MedicalRecordController.searchMedicalRecords);
router.get('/:id', authorizeRoles('admin', 'customer'), MedicalRecordController.getMedicalRecordById);
router.post('/', authorizeRoles('admin'), MedicalRecordController.createMedicalRecord);
router.put('/:id', authorizeRoles('admin'), MedicalRecordController.updateMedicalRecord);
router.delete('/:id', authorizeRoles('admin'), MedicalRecordController.deleteMedicalRecord);

export default router;
