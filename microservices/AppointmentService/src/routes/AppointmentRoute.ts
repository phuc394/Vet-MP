import express from 'express';
import * as AppointmentController from '../controllers/AppointmentController';

const router = express.Router();

router.get('/', AppointmentController.getAllAppointments);
router.get('/search', AppointmentController.searchAppointments);
router.post('/cancel/:id', AppointmentController.cancelAppointment);
router.get('/pet/:petId', AppointmentController.getAppointmentsByPetId);
router.get('/staff/:staffId', AppointmentController.getAppointmentsByStaffId);
router.get('/date-range/:startDate/:endDate', AppointmentController.getAppointmentsByDateRange);
router.get('/:id', AppointmentController.getAppointmentById);
router.post('/', AppointmentController.createAppointment);
router.put('/:id', AppointmentController.updateAppointment);
router.delete('/:id', AppointmentController.deleteAppointment);

export default router;