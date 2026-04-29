import express from 'express';
import * as AppointmentController from '../controllers/AppointmentController';

const router = express.Router();

router.get('/', AppointmentController.getAllAppointments);
router.get('/:id', AppointmentController.getAppointmentById);
router.post('/', AppointmentController.createAppointment);
router.put('/:id', AppointmentController.updateAppointment);
router.delete('/:id', AppointmentController.deleteAppointment);


export default router;