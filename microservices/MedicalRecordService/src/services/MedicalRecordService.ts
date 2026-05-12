const connection = require('../config/database');
import { MedicalRecord, CreateMedicalRecordRequest, UpdateMedicalRecordRequest } from '../models/MedicalRecordModel';

async function createMedicalRecord(medicalRecordData: CreateMedicalRecordRequest): Promise<MedicalRecord> {
    const medicalRecord: Omit<MedicalRecord, 'record_id'> = {
        appointment_id: medicalRecordData.appointment_id,
        symptoms: medicalRecordData.symptoms,
        diagnosis: medicalRecordData.diagnosis,
        notes: medicalRecordData.notes,
        status: medicalRecordData.status,
        created_at: new Date(),
        updated_at: new Date()
    };
    
    const result = await connection.query('INSERT INTO MedicalRecord SET ?', medicalRecord);
    return result;
}

async function getMedicalRecordById(id: number): Promise<MedicalRecord | null> {
    const result = await connection.query('SELECT * FROM MedicalRecord WHERE record_id = ?', [id]);
    return result.length > 0 ? result[0] : null;
}

async function updateMedicalRecord(id: number, medicalRecordData: UpdateMedicalRecordRequest): Promise<MedicalRecord> {
    const result = await connection.query('UPDATE MedicalRecord SET ? WHERE record_id = ?', [medicalRecordData, id]);
    return result;
}

async function deleteMedicalRecord(id: number): Promise<void> {
    await connection.query('DELETE FROM MedicalRecord WHERE record_id = ?', [id]);
}

async function getAllMedicalRecords(): Promise<MedicalRecord[]> {
    const results = await connection.query('SELECT * FROM MedicalRecord');
    return results;
}

async function searchMedicalRecords(symptoms?: string, diagnosis?: string, status?: string): Promise<MedicalRecord[]> {
    let sql = 'SELECT * FROM MedicalRecord WHERE 1=1';
    const params: any[] = [];
    
    if (symptoms) {
        sql += ' AND symptoms LIKE ?';
        params.push(`%${symptoms}%`);
    }
    
    if (diagnosis) {
        sql += ' AND diagnosis LIKE ?';
        params.push(`%${diagnosis}%`);
    }
    
    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }
    
    const results = await connection.query(sql, params);
    return results;
}

export {
    createMedicalRecord,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord,
    getAllMedicalRecords,
    searchMedicalRecords
};
