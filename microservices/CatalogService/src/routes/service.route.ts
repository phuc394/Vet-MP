import express from 'express';
import * as ServiceController from '../controllers/service.controller';

const router = express.Router();

router.get('/', ServiceController.getAllServices);
router.get('/search', ServiceController.searchServices);
router.get('/:id', ServiceController.getServiceById);
router.post('/', ServiceController.createService);
router.put('/:id', ServiceController.updateService);
router.delete('/:id', ServiceController.deleteService);

export default router;
