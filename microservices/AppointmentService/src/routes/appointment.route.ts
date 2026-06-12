import express from 'express';
import * as AppointmentController from '../controllers/appointment.controller';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { identityMiddleware } from '../middleware/identity.middleware';

const router = express.Router();

router.use(identityMiddleware);

router.get('/', authorizeRoles('admin', 'staff', 'customer'), AppointmentController.getAllAppointments);
router.get('/search', authorizeRoles('admin', 'staff', 'customer'), AppointmentController.searchAppointments);
router.get('/:id', authorizeRoles('admin', 'staff', 'customer'), AppointmentController.getAppointmentById);
router.post('/', authorizeRoles('admin', 'customer'), AppointmentController.createAppointment);
router.put('/:id', authorizeRoles('admin', 'staff', 'customer'), AppointmentController.updateAppointment);
router.delete('/:id', authorizeRoles('admin', 'staff'), AppointmentController.deleteAppointment);

export default router;
