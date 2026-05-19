import connection from '../config/database';
import { Prescription, CreatePrescriptionRequest, UpdatePrescriptionRequest } from '../models/PrescriptionModel';

async function getAllPrescriptions(): Promise<Prescription[]> {
    const [rows] = await connection.query('SELECT * FROM Prescription');
    return rows as Prescription[];
}

async function getPrescriptionById(id: number): Promise<Prescription | null> {
    const [rows] = await connection.query('SELECT * FROM Prescription WHERE prescription_id = ?', [id]);
    const prescriptions = rows as Prescription[];
    return prescriptions.length > 0 ? prescriptions[0] ?? null : null;
}

async function getPrescriptionsByRecordId(recordId: number): Promise<Prescription[]> {
    const [rows] = await connection.query('SELECT * FROM Prescription WHERE record_id = ?', [recordId]);
    return rows as Prescription[];
}

async function createPrescription(prescriptionData: CreatePrescriptionRequest): Promise<Prescription> {
    const prescription: Omit<Prescription, 'prescription_id'> = {
        record_id: prescriptionData.record_id,
        medicine_id: prescriptionData.medicine_id,
        quantity: prescriptionData.quantity,
        dosage: prescriptionData.dosage,
        usage_instructions: prescriptionData.usage_instructions,
        notes: prescriptionData.notes,
        created_at: new Date()
    };
    
    const [result] = await connection.query('INSERT INTO Prescription SET ?', prescription);
    const insertId = (result as any).insertId;
    return { ...prescription, prescription_id: insertId };
}

async function updatePrescription(id: number, prescriptionData: UpdatePrescriptionRequest): Promise<Prescription> {
    await connection.query('UPDATE Prescription SET ? WHERE prescription_id = ?', [prescriptionData, id]);
    const prescription = await getPrescriptionById(id);
    if (!prescription) {
        throw new Error(`Prescription ${id} not found after update`);
    }
    return prescription;
}

async function deletePrescription(id: number): Promise<void> {
    await connection.query('DELETE FROM Prescription WHERE prescription_id = ?', [id]);
}

export {
    getAllPrescriptions,
    getPrescriptionById,
    getPrescriptionsByRecordId,
    createPrescription,
    updatePrescription,
    deletePrescription
};
