import express from 'express';
import * as PrescriptionController from '../controllers/prescription.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'staff', 'customer'), PrescriptionController.getAllPrescriptions);
router.get('/search', authorizeRoles('admin', 'staff', 'customer'), PrescriptionController.searchPrescriptions);
router.get('/:id', authorizeRoles('admin', 'staff', 'customer'), PrescriptionController.getPrescriptionById);
router.post('/', authorizeRoles('admin', 'staff'), PrescriptionController.createPrescription);
router.put('/:id', authorizeRoles('admin', 'staff'), PrescriptionController.updatePrescription);
router.delete('/:id', authorizeRoles('admin', 'staff'), PrescriptionController.deletePrescription);

export default router;
