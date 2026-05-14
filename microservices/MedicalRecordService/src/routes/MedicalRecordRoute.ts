import express from 'express';
import {
    createMedicalRecord,
    deleteMedicalRecord,
    getAllMedicalRecords,
    getMedicalRecordById,
    searchMedicalRecords,
    updateMedicalRecord
} from '../controllers/MedicalRecordController';

const router = express.Router();

router.get('/', getAllMedicalRecords);
router.get('/search', searchMedicalRecords);
router.get('/:id', getMedicalRecordById);
router.post('/', createMedicalRecord);
router.put('/:id', updateMedicalRecord);
router.delete('/:id', deleteMedicalRecord);

export default router;
