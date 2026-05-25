import connection from '../config/database.config';
import {
    Appointment,
    AppointmentSearchFilters,
    AppointmentSortQuery,
    AppointmentStatus,
    CreateAppointmentRequest,
    SortOrder,
    UpdateAppointmentRequest
} from '../models/appointment.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = [
    'appointment_id',
    'pet_id',
    'service_id',
    'staff_id',
    'appointment_date',
    'start_time',
    'end_time',
    'status',
    'created_at',
    'updated_at'
];

const DATE_FIELDS = [
    'appointment_date',
    'start_time',
    'end_time',
    'created_at',
    'updated_at'
];

const DEFAULT_SORT_BY = 'created_at';
const VALID_APPOINTMENT_STATUSES: AppointmentStatus[] = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.COMPLETED
];

function resolveSort(query: AppointmentSortQuery | undefined): { sortBy: string; order: SortOrder; mode: SortMode } {
    const sortByRaw = typeof query?.sortBy === 'string' ? query.sortBy.trim() : '';
    const sortBy = sortByRaw.length > 0 ? sortByRaw : DEFAULT_SORT_BY;

    if (!SORT_FIELDS.includes(sortBy)) {
        throw new HttpError(400, `sortBy must be one of: ${SORT_FIELDS.join(', ')}`);
    }

    const orderRaw = typeof query?.order === 'string' ? query.order.toLowerCase() : '';
    const defaultOrder: SortOrder = DATE_FIELDS.includes(sortBy) ? 'desc' : 'asc';
    const order: SortOrder = orderRaw === 'asc' || orderRaw === 'desc' ? orderRaw : defaultOrder;

    const mode: SortMode = DATE_FIELDS.includes(sortBy)
        ? order === 'desc'
            ? 'Newest'
            : 'Oldest'
        : order === 'asc'
            ? 'A-Z'
            : 'Z-A';

    if (!['A-Z', 'Z-A', 'Newest', 'Oldest'].includes(mode)) {
        throw new HttpError(400, 'Invalid sort mode');
    }

    return { sortBy, order, mode };
}

async function getAllAppointments(sortQuery?: AppointmentSortQuery): Promise<Appointment[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Appointment ORDER BY ${sortBy} ${order}`);
    return rows as Appointment[];
}

async function getAppointmentsByOwnerId(ownerId: number, sortQuery?: AppointmentSortQuery): Promise<Appointment[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(
        `SELECT a.*
         FROM Appointment a
         INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
         WHERE p.owner_id = ? AND p.is_deleted = FALSE
         ORDER BY a.${sortBy} ${order}`,
        [ownerId]
    );
    return rows as Appointment[];
}

async function getAppointmentById(id: number): Promise<Appointment | null> {
    const [rows] = await connection.query('SELECT * FROM Appointment WHERE appointment_id = ?', [id]);
    const appointments = rows as Appointment[];
    return appointments.length > 0 ? appointments[0] ?? null : null;
}

async function isAppointmentOwnedByUser(id: number, ownerId: number): Promise<boolean> {
    const [rows] = await connection.query(
        `SELECT a.appointment_id
         FROM Appointment a
         INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
         WHERE a.appointment_id = ? AND p.owner_id = ? AND p.is_deleted = FALSE
         LIMIT 1`,
        [id, ownerId]
    );
    return (rows as Array<{ appointment_id: number }>).length > 0;
}

async function isPetOwnedByUser(petId: number, ownerId: number): Promise<boolean> {
    const [rows] = await connection.query(
        `SELECT pet_id
         FROM pet_db_vet.Pet
         WHERE pet_id = ? AND owner_id = ? AND is_deleted = FALSE
         LIMIT 1`,
        [petId, ownerId]
    );
    return (rows as Array<{ pet_id: number }>).length > 0;
}

async function createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const appointment: Omit<Appointment, 'appointment_id'> = {
        pet_id: appointmentData.pet_id,
        service_id: appointmentData.service_id,
        appointment_date: appointmentData.appointment_date,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        status: AppointmentStatus.PENDING,
        service_price: appointmentData.service_price,
        created_at: new Date(),
        updated_at: new Date()
    };

    if (appointmentData.staff_id !== undefined) {
        appointment.staff_id = appointmentData.staff_id;
    }

    const [result] = await connection.query('INSERT INTO Appointment SET ?', [appointment]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...appointment, appointment_id: insertId };
}

async function updateAppointment(id: number, appointmentData: UpdateAppointmentRequest): Promise<Appointment | null> {
    const updateData = Object.fromEntries(
        Object.entries(appointmentData).filter(([, value]) => value !== undefined)
    );

    const payload = {
        ...updateData,
        updated_at: new Date()
    };

    await connection.query('UPDATE Appointment SET ? WHERE appointment_id = ?', [payload, id]);

    const updatedAppointment = await getAppointmentById(id);
    return updatedAppointment;
}

async function deleteAppointment(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Appointment WHERE appointment_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchAppointments(filters: AppointmentSearchFilters): Promise<Appointment[]> {
    let sql = 'SELECT * FROM Appointment WHERE 1=1';
    const params: Array<string | number | Date> = [];

    if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
    }

    if (filters.startDate && filters.endDate) {
        sql += ' AND appointment_date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
        sql += ' AND appointment_date >= ?';
        params.push(filters.startDate);
    } else if (filters.endDate) {
        sql += ' AND appointment_date <= ?';
        params.push(filters.endDate);
    }

    if (filters.petId) {
        sql += ' AND pet_id = ?';
        params.push(filters.petId);
    }

    if (filters.staffId) {
        sql += ' AND staff_id = ?';
        params.push(filters.staffId);
    }

    sql += ' LIMIT 10';

    const [rows] = await connection.query(sql, params);
    return rows as Appointment[];
}

async function searchAppointmentsByOwnerId(
    ownerId: number,
    filters: AppointmentSearchFilters
): Promise<Appointment[]> {
    let sql = `
        SELECT a.*
        FROM Appointment a
        INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
        WHERE p.owner_id = ? AND p.is_deleted = FALSE
    `;
    const params: Array<string | number | Date> = [ownerId];

    if (filters.status) {
        sql += ' AND a.status = ?';
        params.push(filters.status);
    }

    if (filters.startDate && filters.endDate) {
        sql += ' AND a.appointment_date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
        sql += ' AND a.appointment_date >= ?';
        params.push(filters.startDate);
    } else if (filters.endDate) {
        sql += ' AND a.appointment_date <= ?';
        params.push(filters.endDate);
    }

    if (filters.petId) {
        sql += ' AND a.pet_id = ?';
        params.push(filters.petId);
    }

    if (filters.staffId) {
        sql += ' AND a.staff_id = ?';
        params.push(filters.staffId);
    }

    sql += ' LIMIT 10';

    const [rows] = await connection.query(sql, params);
    return rows as Appointment[];
}

function resolveAppointmentStatus(value: string): AppointmentStatus {
    if (!VALID_APPOINTMENT_STATUSES.includes(value as AppointmentStatus)) {
        throw new HttpError(400, `status must be one of: ${VALID_APPOINTMENT_STATUSES.join(', ')}`);
    }
    return value as AppointmentStatus;
}

export {
    getAllAppointments,
    getAppointmentsByOwnerId,
    getAppointmentById,
    isAppointmentOwnedByUser,
    isPetOwnedByUser,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    searchAppointments,
    searchAppointmentsByOwnerId,
    resolveAppointmentStatus
};
