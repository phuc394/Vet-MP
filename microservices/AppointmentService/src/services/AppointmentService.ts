const connection = require('../config/database');
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentStatus } from '../models/AppointmentModel';

async function getAllAppointments(): Promise<Appointment[]> {
    const results = await connection.query('SELECT * FROM Appointment');
    return results;
}

async function getAppointmentById(id: number): Promise<Appointment | null> {
    const results = await connection.query('SELECT * FROM Appointment WHERE appointment_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
}

async function createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const appointment: Omit<Appointment, 'appointment_id'> = {
        pet_id: appointmentData.pet_id,
        service_id: appointmentData.service_id,
        staff_id: appointmentData.staff_id,
        appointment_date: appointmentData.appointment_date,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        status: AppointmentStatus.SCHEDULED,
        service_price: appointmentData.service_price,
        created_at: new Date(),
        updated_at: new Date()
    };
    
    const results = await connection.query('INSERT INTO Appointment SET ?', [appointment]);
    return { ...appointment, appointment_id: results.insertId };
}

async function updateAppointment(id: number, appointmentData: UpdateAppointmentRequest): Promise<Appointment | null> {
    const updateData = {
        ...appointmentData,
        updated_at: new Date()
    };
    
    await connection.query('UPDATE Appointment SET ? WHERE appointment_id = ?', [updateData, id]);
    
    const updatedAppointment = await getAppointmentById(id);
    return updatedAppointment;
}

async function deleteAppointment(id: number): Promise<boolean> {
    const results = await connection.query('DELETE FROM Appointment WHERE appointment_id = ?', [id]);
    return results.affectedRows > 0;
}

async function getAppointmentsByPetId(petId: number): Promise<Appointment[]> {
    const results = await connection.query('SELECT * FROM Appointment WHERE pet_id = ?', [petId]);
    return results;
}

async function getAppointmentsByStaffId(staffId: number): Promise<Appointment[]> {
    const results = await connection.query('SELECT * FROM Appointment WHERE staff_id = ?', [staffId]);
    return results;
}

async function getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    const results = await connection.query(
        'SELECT * FROM Appointment WHERE appointment_date BETWEEN ? AND ?',
        [startDate, endDate]
    );
    return results;
}

async function cancelAppointment(id: number): Promise<boolean> {
    const results = await connection.query('UPDATE Appointment SET status = ? WHERE appointment_id = ?', [AppointmentStatus.CANCELLED, id]);
    return results.affectedRows > 0;
}

async function searchAppointments(status?: string, startDate?: string, endDate?: string, petId?: string, staffId?: string): Promise<Appointment[]> {
    let sql = 'SELECT * FROM Appointment WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }
    
    if (startDate && endDate) {
        sql += ' AND appointment_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    } else if (startDate) {
        sql += ' AND appointment_date >= ?';
        params.push(startDate);
    } else if (endDate) {
        sql += ' AND appointment_date <= ?';
        params.push(endDate);
    }
    
    if (petId) {
        sql += ' AND pet_id = ?';
        params.push(petId);
    }
    
    if (staffId) {
        sql += ' AND staff_id = ?';
        params.push(staffId);
    }
    
    const results = await connection.query(sql, params);
    return results;
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