import express from 'express';
import * as ReExaminationController from '../controllers/re-examination.controller';

const router = express.Router();

router.get('/', ReExaminationController.getAllReExaminations);
router.get('/search', ReExaminationController.searchReExaminations);
router.get('/:id', ReExaminationController.getReExaminationById);
router.post('/', ReExaminationController.createReExamination);
router.put('/:id', ReExaminationController.updateReExamination);
router.delete('/:id', ReExaminationController.deleteReExamination);

export default router;
