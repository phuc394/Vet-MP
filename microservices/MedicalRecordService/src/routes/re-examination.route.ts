import express from 'express';
import * as ReExaminationController from '../controllers/re-examination.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'customer'), ReExaminationController.getAllReExaminations);
router.get('/search', authorizeRoles('admin', 'customer'), ReExaminationController.searchReExaminations);
router.get('/:id', authorizeRoles('admin', 'customer'), ReExaminationController.getReExaminationById);
router.post('/', authorizeRoles('admin'), ReExaminationController.createReExamination);
router.put('/:id', authorizeRoles('admin'), ReExaminationController.updateReExamination);
router.delete('/:id', authorizeRoles('admin'), ReExaminationController.deleteReExamination);

export default router;
