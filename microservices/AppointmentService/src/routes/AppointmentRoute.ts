import express from 'express';
import * as AppointmentController from '../controllers/AppointmentController';

const router = express.Router();

router.get('/', AppointmentController.getAllAppointments);
router.get('/:id', AppointmentController.getAppointmentById);
router.post('/', AppointmentController.createAppointment);
router.put('/:id', AppointmentController.updateAppointment);
router.delete('/:id', AppointmentController.deleteAppointment);
router.get('/pet/:petId', AppointmentController.getAppointmentsByPetId);
router.get('/staff/:staffId', AppointmentController.getAppointmentsByStaffId);
router.get('/date-range/:startDate/:endDate', AppointmentController.getAppointmentsByDateRange);
router.post('/cancel/:id', AppointmentController.cancelAppointment);

export default router;