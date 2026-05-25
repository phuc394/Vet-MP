import express from 'express';
import * as PrescriptionController from '../controllers/prescription.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'customer'), PrescriptionController.getAllPrescriptions);
router.get('/search', authorizeRoles('admin', 'customer'), PrescriptionController.searchPrescriptions);
router.get('/:id', authorizeRoles('admin', 'customer'), PrescriptionController.getPrescriptionById);
router.post('/', authorizeRoles('admin'), PrescriptionController.createPrescription);
router.put('/:id', authorizeRoles('admin'), PrescriptionController.updatePrescription);
router.delete('/:id', authorizeRoles('admin'), PrescriptionController.deletePrescription);

export default router;
