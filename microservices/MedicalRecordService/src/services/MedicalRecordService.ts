import connection from '../config/database';
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
    
    const [result] = await connection.query('INSERT INTO MedicalRecord SET ?', medicalRecord);
    return { ...medicalRecord, record_id: result.insertId };
}

async function getMedicalRecordById(id: number): Promise<MedicalRecord | null> {
    const [rows] = await connection.query('SELECT * FROM MedicalRecord WHERE record_id = ?', [id]);
    const medicalRecords = rows as MedicalRecord[];
    return medicalRecords.length > 0 ? medicalRecords[0] ?? null : null;
}

async function updateMedicalRecord(id: number, medicalRecordData: UpdateMedicalRecordRequest): Promise<MedicalRecord> {
    const updateData = {
        ...medicalRecordData,
        updated_at: new Date()
    };

    await connection.query('UPDATE MedicalRecord SET ? WHERE record_id = ?', [updateData, id]);
    const medicalRecord = await getMedicalRecordById(id);
    if (!medicalRecord) {
        throw new Error(`Medical record ${id} not found after update`);
    }
    return medicalRecord;
}

async function deleteMedicalRecord(id: number): Promise<void> {
    await connection.query('DELETE FROM MedicalRecord WHERE record_id = ?', [id]);
}

async function getAllMedicalRecords(): Promise<MedicalRecord[]> {
    const [rows] = await connection.query('SELECT * FROM MedicalRecord');
    return rows as MedicalRecord[];
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
    
    const [rows] = await connection.query(sql, params);
    return rows as MedicalRecord[];
}

export {
    createMedicalRecord,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord,
    getAllMedicalRecords,
    searchMedicalRecords
};
