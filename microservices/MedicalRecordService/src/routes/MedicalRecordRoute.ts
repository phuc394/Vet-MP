const express = require('express');
const router = express.Router();
const { getAllMedicalRecords, getMedicalRecordById, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } = require('../controllers/MedicalRecordController');

router.get('/', getAllMedicalRecords);
router.get('/:id', getMedicalRecordById);
router.post('/', createMedicalRecord);
router.put('/:id', updateMedicalRecord);
router.delete('/:id', deleteMedicalRecord);

module.exports = router;