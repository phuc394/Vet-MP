const express = require('express');
const router = express.Router();
const { getAllPrescriptions, getPrescriptionById, getPrescriptionsByRecordId, createPrescription, updatePrescription, deletePrescription } = require('../controllers/PrescriptionController');

router.get('/', getAllPrescriptions);
router.get('/:id', getPrescriptionById);
router.get('/record/:recordId', getPrescriptionsByRecordId);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;
