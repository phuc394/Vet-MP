import express from 'express';
import * as AppointmentController from '../controllers/appointment.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'customer'), AppointmentController.getAllAppointments);
router.get('/search', authorizeRoles('admin', 'customer'), AppointmentController.searchAppointments);
router.get('/:id', authorizeRoles('admin', 'customer'), AppointmentController.getAppointmentById);
router.post('/', authorizeRoles('customer'), AppointmentController.createAppointment);
router.put('/:id', authorizeRoles('customer'), AppointmentController.updateAppointment);
router.delete('/:id', authorizeRoles('admin'), AppointmentController.deleteAppointment);

export default router;
