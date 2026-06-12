import express from 'express';
import * as MedicalRecordController from '../controllers/medical-record.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'staff', 'customer'), MedicalRecordController.getAllMedicalRecords);
router.get('/search', authorizeRoles('admin', 'staff', 'customer'), MedicalRecordController.searchMedicalRecords);
router.get('/:id', authorizeRoles('admin', 'staff', 'customer'), MedicalRecordController.getMedicalRecordById);
router.post('/', authorizeRoles('admin', 'staff'), MedicalRecordController.createMedicalRecord);
router.put('/:id', authorizeRoles('admin', 'staff'), MedicalRecordController.updateMedicalRecord);
router.delete('/:id', authorizeRoles('admin', 'staff'), MedicalRecordController.deleteMedicalRecord);

export default router;
