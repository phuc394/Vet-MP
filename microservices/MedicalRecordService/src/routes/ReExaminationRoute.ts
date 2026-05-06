const express = require('express');
const router = express.Router();
const { getAllReExaminations, getReExaminationById, getReExaminationsByRecordId, createReExamination, updateReExamination, deleteReExamination } = require('../controllers/ReExaminationController');

router.get('/', getAllReExaminations);
router.get('/:id', getReExaminationById);
router.get('/record/:recordId', getReExaminationsByRecordId);
router.post('/', createReExamination);
router.put('/:id', updateReExamination);
router.delete('/:id', deleteReExamination);

export default router;
