import express from 'express';
import {
    createReExamination,
    deleteReExamination,
    getAllReExaminations,
    getReExaminationById,
    getReExaminationsByRecordId,
    updateReExamination
} from '../controllers/ReExaminationController';

const router = express.Router();

router.get('/', getAllReExaminations);
router.get('/record/:recordId', getReExaminationsByRecordId);
router.get('/:id', getReExaminationById);
router.post('/', createReExamination);
router.put('/:id', updateReExamination);
router.delete('/:id', deleteReExamination);

export default router;
