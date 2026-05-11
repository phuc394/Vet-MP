const AppointmentService = require('../services/AppointmentService');

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
        const appointment = await AppointmentService.getAppointmentById(id);
        res.json(appointment);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createAppointment(req: any, res: any) {
   try {
    const { patientId, vetId, appointmentDate, status } = req.body;
    const result = await AppointmentService.createAppointment({ patientId, vetId, appointmentDate, status });
    res.json(result);
   } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
   }
}

async function updateAppointment(req: any, res: any) {
    try {
        const { id } = req.params;
        const { patientId, vetId, appointmentDate, status } = req.body;
        const result = await AppointmentService.updateAppointment(id, { patientId, vetId, appointmentDate, status });
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteAppointment(req: any, res: any) {
    try {
        const { id } = req.params;
        const result = await AppointmentService.deleteAppointment(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAppointmentsByPetId(req: any, res: any) {
    try {
        const { petId } = req.params;
        const appointments = await AppointmentService.getAppointmentsByPetId(petId);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAppointmentsByStaffId(req: any, res: any) {
    try {
        const { staffId } = req.params;
        const appointments = await AppointmentService.getAppointmentsByStaffId(staffId);
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
        const result = await AppointmentService.cancelAppointment(id);
        res.json(result);
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
    cancelAppointment
};