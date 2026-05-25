import express from 'express';
import * as ServiceController from '../controllers/service.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'customer'), ServiceController.getAllServices);
router.get('/search', authorizeRoles('admin', 'customer'), ServiceController.searchServices);
router.get('/:id', authorizeRoles('admin', 'customer'), ServiceController.getServiceById);
router.post('/', authorizeRoles('admin'), ServiceController.createService);
router.put('/:id', authorizeRoles('admin'), ServiceController.updateService);
router.delete('/:id', authorizeRoles('admin'), ServiceController.deleteService);

export default router;
