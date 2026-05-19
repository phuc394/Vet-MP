import * as AppointmentService from '../services/AppointmentService';

async function getAllAppointments(_req: any, res: any) {
    try {
        const appointments = await AppointmentService.getAllAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAppointmentById(req: any, res: any) {
    try {
        const { id } = req.params;
        const appointment = await AppointmentService.getAppointmentById(Number(id));
        res.json(appointment);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createAppointment(req: any, res: any) {
   try {
    const { pet_id, staff_id, appointment_date, service_id, start_time, end_time, service_price } = req.body;
    const result = await AppointmentService.createAppointment({ pet_id, staff_id, appointment_date, service_id, start_time, end_time, service_price  });
    res.json(result);
   } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
   }
}

async function updateAppointment(req: any, res: any) {
    try {
        const { id } = req.params;
        const { pet_id, staff_id, appointment_date, service_id, start_time, end_time, service_price } = req.body;
        const result = await AppointmentService.updateAppointment(Number(id), { pet_id, staff_id, appointment_date, service_id, start_time, end_time, service_price });
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteAppointment(req: any, res: any) {
    try {
        const { id } = req.params;
        const result = await AppointmentService.deleteAppointment(Number(id));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAppointmentsByPetId(req: any, res: any) {
    try {
        const { petId } = req.params;
        const appointments = await AppointmentService.getAppointmentsByPetId(Number(petId));
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAppointmentsByStaffId(req: any, res: any) {
    try {
        const { staffId } = req.params;
        const appointments = await AppointmentService.getAppointmentsByStaffId(Number(staffId));
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAppointmentsByDateRange(req: any, res: any) {
    try {
        const { startDate, endDate } = req.params;
        const appointments = await AppointmentService.getAppointmentsByDateRange(startDate, endDate);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function cancelAppointment(req: any, res: any) {
    try {
        const { id } = req.params;
        const result = await AppointmentService.cancelAppointment(Number(id));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function searchAppointments(req: any, res: any) {
    try {
        const { status, startDate, endDate, petId, staffId } = req.query;
        const appointments = await AppointmentService.searchAppointments(status, startDate, endDate, petId, staffId);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByPetId,
    getAppointmentsByStaffId,
    getAppointmentsByDateRange,
    cancelAppointment,
    searchAppointments
};
