const connection = require('../config/database');
import { Prescription, CreatePrescriptionRequest, UpdatePrescriptionRequest } from '../models/PrescriptionModel';

async function getAllPrescriptions(): Promise<Prescription[]> {
    const result = await connection.query('SELECT * FROM Prescription');
    return result;
}

async function getPrescriptionById(id: number): Promise<Prescription | null> {
    const result = await connection.query('SELECT * FROM Prescription WHERE prescription_id = ?', [id]);
    return result.length > 0 ? result[0] : null;
}

async function getPrescriptionsByRecordId(recordId: number): Promise<Prescription[]> {
    const result = await connection.query('SELECT * FROM Prescription WHERE record_id = ?', [recordId]);
    return result;
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
    
    const result = await connection.query('INSERT INTO Prescription SET ?', prescription);
    return result;
}

async function updatePrescription(id: number, prescriptionData: UpdatePrescriptionRequest): Promise<Prescription> {
    const result = await connection.query('UPDATE Prescription SET ? WHERE prescription_id = ?', [prescriptionData, id]);
    return result;
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
