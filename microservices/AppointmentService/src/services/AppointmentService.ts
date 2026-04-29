const connection = require('../config/database');

async function getAllAppointments() {
    const results = await connection.query('SELECT * FROM Appointment');
    return results;
}

async function getAppointmentById(id: Number) {
    const results = await connection.query('SELECT * FROM Appointment WHERE appointment_id = ?', [id]);
    return results;
}

async function createAppointment(appointment: any) {
    const results = await connection.query('INSERT INTO Appointment SET ?', [appointment]);
    return results;
}

async function updateAppointment(id: Number, appointment: any) {
    const results = await connection.query('UPDATE Appointment SET ? WHERE appointment_id = ?', [appointment, id]);
    return results;
}

async function deleteAppointment(id: Number) {
    const results = await connection.query('DELETE FROM Appointment WHERE appointment_id = ?', [id]);
    return results;
}

export {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};