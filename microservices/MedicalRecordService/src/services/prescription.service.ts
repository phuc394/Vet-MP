import connection from '../config/database.config';
import {
    CreatePrescriptionRequest,
    Prescription,
    PrescriptionSearchFilters,
    PrescriptionSortQuery,
    SortOrder,
    UpdatePrescriptionRequest
} from '../models/prescription.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = [
    'prescription_id',
    'record_id',
    'medicine_id',
    'quantity',
    'dosage',
    'usage_instructions',
    'created_at'
];

const DATE_FIELDS = ['created_at'];
const DEFAULT_SORT_BY = 'created_at';

function resolveSort(query?: PrescriptionSortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
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

async function getAllPrescriptions(sortQuery?: PrescriptionSortQuery): Promise<Prescription[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Prescription ORDER BY ${sortBy} ${order}`);
    return rows as Prescription[];
}

async function getPrescriptionsByOwnerId(ownerId: number, sortQuery?: PrescriptionSortQuery): Promise<Prescription[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(
        `SELECT pr.*
         FROM Prescription pr
         INNER JOIN Medical_Record mr ON mr.record_id = pr.record_id
         INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
         INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
         WHERE p.owner_id = ? AND p.is_deleted = FALSE
         ORDER BY pr.${sortBy} ${order}`,
        [ownerId]
    );
    return rows as Prescription[];
}

async function getPrescriptionById(id: number): Promise<Prescription | null> {
    const [rows] = await connection.query('SELECT * FROM Prescription WHERE prescription_id = ?', [id]);
    const prescriptions = rows as Prescription[];
    return prescriptions.length > 0 ? prescriptions[0] ?? null : null;
}

async function isPrescriptionOwnedByUser(id: number, ownerId: number): Promise<boolean> {
    const [rows] = await connection.query(
        `SELECT pr.prescription_id
         FROM Prescription pr
         INNER JOIN Medical_Record mr ON mr.record_id = pr.record_id
         INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
         INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
         WHERE pr.prescription_id = ? AND p.owner_id = ? AND p.is_deleted = FALSE
         LIMIT 1`,
        [id, ownerId]
    );
    return (rows as Array<{ prescription_id: number }>).length > 0;
}

async function createPrescription(prescriptionData: CreatePrescriptionRequest): Promise<Prescription> {
    const prescription: Omit<Prescription, 'prescription_id'> = {
        record_id: prescriptionData.record_id,
        medicine_id: prescriptionData.medicine_id,
        quantity: prescriptionData.quantity,
        created_at: new Date()
    };

    if (prescriptionData.dosage !== undefined) {
        prescription.dosage = prescriptionData.dosage;
    }

    if (prescriptionData.usage_instructions !== undefined) {
        prescription.usage_instructions = prescriptionData.usage_instructions;
    }

    if (prescriptionData.notes !== undefined) {
        prescription.notes = prescriptionData.notes;
    }

    const [result] = await connection.query('INSERT INTO Prescription SET ?', [prescription]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...prescription, prescription_id: insertId };
}

async function updatePrescription(id: number, prescriptionData: UpdatePrescriptionRequest): Promise<Prescription | null> {
    const updateData = Object.fromEntries(Object.entries(prescriptionData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData
    };

    const [result] = await connection.query('UPDATE Prescription SET ? WHERE prescription_id = ?', [payload, id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getPrescriptionById(id);
}

async function deletePrescription(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Prescription WHERE prescription_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchPrescriptions(filters: PrescriptionSearchFilters): Promise<Prescription[]> {
    let sql = 'SELECT * FROM Prescription WHERE 1=1';
    const params: Array<string | number> = [];

    if (filters.recordId !== undefined) {
        sql += ' AND record_id = ?';
        params.push(filters.recordId);
    }

    if (filters.medicineId !== undefined) {
        sql += ' AND medicine_id = ?';
        params.push(filters.medicineId);
    }

    if (filters.dosage) {
        sql += ' AND dosage LIKE ?';
        params.push(`%${filters.dosage}%`);
    }

    if (filters.usageInstructions) {
        sql += ' AND usage_instructions LIKE ?';
        params.push(`%${filters.usageInstructions}%`);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as Prescription[];
}

async function searchPrescriptionsByOwnerId(
    ownerId: number,
    filters: PrescriptionSearchFilters
): Promise<Prescription[]> {
    let sql = `
        SELECT pr.*
        FROM Prescription pr
        INNER JOIN Medical_Record mr ON mr.record_id = pr.record_id
        INNER JOIN appointment_db_vet.Appointment a ON a.appointment_id = mr.appointment_id
        INNER JOIN pet_db_vet.Pet p ON p.pet_id = a.pet_id
        WHERE p.owner_id = ? AND p.is_deleted = FALSE
    `;
    const params: Array<string | number> = [ownerId];

    if (filters.recordId !== undefined) {
        sql += ' AND pr.record_id = ?';
        params.push(filters.recordId);
    }

    if (filters.medicineId !== undefined) {
        sql += ' AND pr.medicine_id = ?';
        params.push(filters.medicineId);
    }

    if (filters.dosage) {
        sql += ' AND pr.dosage LIKE ?';
        params.push(`%${filters.dosage}%`);
    }

    if (filters.usageInstructions) {
        sql += ' AND pr.usage_instructions LIKE ?';
        params.push(`%${filters.usageInstructions}%`);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as Prescription[];
}

export {
    getAllPrescriptions,
    getPrescriptionsByOwnerId,
    getPrescriptionById,
    isPrescriptionOwnedByUser,
    createPrescription,
    updatePrescription,
    deletePrescription,
    searchPrescriptions,
    searchPrescriptionsByOwnerId
};
