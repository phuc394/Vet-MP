import connection from '../config/database.config';
import {
    CreateMedicalRecordRequest,
    MedicalRecord,
    MedicalRecordStatus,
    MedicalRecordSearchFilters,
    MedicalRecordSortQuery,
    SortOrder,
    UpdateMedicalRecordRequest
} from '../models/medical-record.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = [
    'record_id',
    'appointment_id',
    'symptoms',
    'diagnosis',
    'status',
    'created_at',
    'updated_at'
];

const DATE_FIELDS = ['created_at', 'updated_at'];
const DEFAULT_SORT_BY = 'created_at';
const VALID_MEDICAL_RECORD_STATUSES: MedicalRecordStatus[] = [
    MedicalRecordStatus.IN_PROGRESS,
    MedicalRecordStatus.COMPLETED
];

function resolveSort(query?: MedicalRecordSortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
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

async function getAllMedicalRecords(sortQuery?: MedicalRecordSortQuery): Promise<MedicalRecord[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Medical_Record ORDER BY ${sortBy} ${order}`);
    return rows as MedicalRecord[];
}

async function getMedicalRecordsByOwnerId(ownerId: number, sortQuery?: MedicalRecordSortQuery): Promise<MedicalRecord[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(
        `SELECT mr.*
         FROM Medical_Record mr
         INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
         INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
         WHERE p.owner_id = ? AND p.is_deleted = FALSE
         ORDER BY mr.${sortBy} ${order}`,
        [ownerId]
    );
    return rows as MedicalRecord[];
}

async function getMedicalRecordsByStaffId(staffId: number, sortQuery?: MedicalRecordSortQuery): Promise<MedicalRecord[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(
        `SELECT mr.*
         FROM Medical_Record mr
         INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
         WHERE a.staff_id = ?
         ORDER BY mr.${sortBy} ${order}`,
        [staffId]
    );
    return rows as MedicalRecord[];
}

async function getMedicalRecordById(id: number): Promise<MedicalRecord | null> {
    const [rows] = await connection.query('SELECT * FROM Medical_Record WHERE record_id = ?', [id]);
    const records = rows as MedicalRecord[];
    return records.length > 0 ? records[0] ?? null : null;
}

async function isMedicalRecordOwnedByUser(id: number, ownerId: number): Promise<boolean> {
    const [rows] = await connection.query(
        `SELECT mr.record_id
         FROM Medical_Record mr
         INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
         INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
         WHERE mr.record_id = ? AND p.owner_id = ? AND p.is_deleted = FALSE
         LIMIT 1`,
        [id, ownerId]
    );
    return (rows as Array<{ record_id: number }>).length > 0;
}

async function isMedicalRecordAssignedToStaff(id: number, staffId: number): Promise<boolean> {
    const [rows] = await connection.query(
        `SELECT mr.record_id
         FROM Medical_Record mr
         INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
         WHERE mr.record_id = ? AND a.staff_id = ?
         LIMIT 1`,
        [id, staffId]
    );
    return (rows as Array<{ record_id: number }>).length > 0;
}

async function isAppointmentAssignedToStaff(appointmentId: number, staffId: number): Promise<boolean> {
    const [rows] = await connection.query(
        `SELECT appointment_id
         FROM appointment_db_vet.Appointment
         WHERE appointment_id = ? AND staff_id = ?
         LIMIT 1`,
        [appointmentId, staffId]
    );
    return (rows as Array<{ appointment_id: number }>).length > 0;
}

async function createMedicalRecord(medicalRecordData: CreateMedicalRecordRequest): Promise<MedicalRecord> {
    const medicalRecord: Omit<MedicalRecord, 'record_id'> = {
        appointment_id: medicalRecordData.appointment_id,
        status: medicalRecordData.status ?? MedicalRecordStatus.IN_PROGRESS,
        created_at: new Date(),
        updated_at: new Date()
    };

    if (medicalRecordData.symptoms !== undefined) {
        medicalRecord.symptoms = medicalRecordData.symptoms;
    }

    if (medicalRecordData.diagnosis !== undefined) {
        medicalRecord.diagnosis = medicalRecordData.diagnosis;
    }

    if (medicalRecordData.notes !== undefined) {
        medicalRecord.notes = medicalRecordData.notes;
    }

    const [result] = await connection.query('INSERT INTO Medical_Record SET ?', [medicalRecord]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...medicalRecord, record_id: insertId };
}

async function updateMedicalRecord(id: number, medicalRecordData: UpdateMedicalRecordRequest): Promise<MedicalRecord | null> {
    const updateData = Object.fromEntries(Object.entries(medicalRecordData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData,
        updated_at: new Date()
    };

    const [result] = await connection.query('UPDATE Medical_Record SET ? WHERE record_id = ?', [payload, id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getMedicalRecordById(id);
}

async function deleteMedicalRecord(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Medical_Record WHERE record_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchMedicalRecords(filters: MedicalRecordSearchFilters): Promise<MedicalRecord[]> {
    let sql = 'SELECT * FROM Medical_Record WHERE 1=1';
    const params: Array<string | number> = [];

    if (filters.appointmentId !== undefined) {
        sql += ' AND appointment_id = ?';
        params.push(filters.appointmentId);
    }

    if (filters.symptoms) {
        sql += ' AND symptoms LIKE ?';
        params.push(`%${filters.symptoms}%`);
    }

    if (filters.diagnosis) {
        sql += ' AND diagnosis LIKE ?';
        params.push(`%${filters.diagnosis}%`);
    }

    if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as MedicalRecord[];
}

async function searchMedicalRecordsByOwnerId(
    ownerId: number,
    filters: MedicalRecordSearchFilters
): Promise<MedicalRecord[]> {
    let sql = `
        SELECT mr.*
        FROM Medical_Record mr
        INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
        INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
        WHERE p.owner_id = ? AND p.is_deleted = FALSE
    `;
    const params: Array<string | number> = [ownerId];

    if (filters.appointmentId !== undefined) {
        sql += ' AND mr.appointment_id = ?';
        params.push(filters.appointmentId);
    }

    if (filters.symptoms) {
        sql += ' AND mr.symptoms LIKE ?';
        params.push(`%${filters.symptoms}%`);
    }

    if (filters.diagnosis) {
        sql += ' AND mr.diagnosis LIKE ?';
        params.push(`%${filters.diagnosis}%`);
    }

    if (filters.status) {
        sql += ' AND mr.status = ?';
        params.push(filters.status);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as MedicalRecord[];
}

async function searchMedicalRecordsByStaffId(
    staffId: number,
    filters: MedicalRecordSearchFilters
): Promise<MedicalRecord[]> {
    let sql = `
        SELECT mr.*
        FROM Medical_Record mr
        INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
        WHERE a.staff_id = ?
    `;
    const params: Array<string | number> = [staffId];

    if (filters.appointmentId !== undefined) {
        sql += ' AND mr.appointment_id = ?';
        params.push(filters.appointmentId);
    }

    if (filters.symptoms) {
        sql += ' AND mr.symptoms LIKE ?';
        params.push(`%${filters.symptoms}%`);
    }

    if (filters.diagnosis) {
        sql += ' AND mr.diagnosis LIKE ?';
        params.push(`%${filters.diagnosis}%`);
    }

    if (filters.status) {
        sql += ' AND mr.status = ?';
        params.push(filters.status);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as MedicalRecord[];
}

function resolveMedicalRecordStatus(value: string): MedicalRecordStatus {
    if (!VALID_MEDICAL_RECORD_STATUSES.includes(value as MedicalRecordStatus)) {
        throw new HttpError(400, `status must be one of: ${VALID_MEDICAL_RECORD_STATUSES.join(', ')}`);
    }
    return value as MedicalRecordStatus;
}

export {
    getAllMedicalRecords,
    getMedicalRecordsByOwnerId,
    getMedicalRecordsByStaffId,
    getMedicalRecordById,
    isMedicalRecordOwnedByUser,
    isMedicalRecordAssignedToStaff,
    isAppointmentAssignedToStaff,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    searchMedicalRecords,
    searchMedicalRecordsByOwnerId,
    searchMedicalRecordsByStaffId,
    resolveMedicalRecordStatus
};
