import express from 'express';
import {
    createPrescription,
    deletePrescription,
    getAllPrescriptions,
    getPrescriptionById,
    getPrescriptionsByRecordId,
    updatePrescription
} from '../controllers/PrescriptionController';

const router = express.Router();

router.get('/', getAllPrescriptions);
router.get('/:id', getPrescriptionById);
router.get('/record/:recordId', getPrescriptionsByRecordId);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;
