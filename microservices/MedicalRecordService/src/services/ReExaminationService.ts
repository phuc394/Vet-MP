import connection from '../config/database';
import { ReExamination, CreateReExaminationRequest, UpdateReExaminationRequest } from '../models/ReExaminationModel';

async function getAllReExaminations(): Promise<ReExamination[]> {
    const [rows] = await connection.query('SELECT * FROM Re_Examination');
    return rows as ReExamination[];
}

async function getReExaminationById(id: number): Promise<ReExamination | null> {
    const [rows] = await connection.query('SELECT * FROM Re_Examination WHERE re_exam_id = ?', [id]);
    const reExaminations = rows as ReExamination[];
    return reExaminations.length > 0 ? reExaminations[0] ?? null : null;
}

async function getReExaminationsByRecordId(recordId: number): Promise<ReExamination[]> {
    const [rows] = await connection.query('SELECT * FROM Re_Examination WHERE record_id = ?', [recordId]);
    return rows as ReExamination[];
}

async function createReExamination(reExaminationData: CreateReExaminationRequest): Promise<ReExamination> {
    const reExamination: Omit<ReExamination, 're_exam_id'> = {
        record_id: reExaminationData.record_id,
        suggested_date: reExaminationData.suggested_date,
        reason: reExaminationData.reason,
        is_booked: reExaminationData.is_booked,
        created_at: new Date()
    };
    
    const [result] = await connection.query('INSERT INTO Re_Examination SET ?', reExamination);
    const insertId = (result as any).insertId;
    return { ...reExamination, re_exam_id: insertId };
}

async function updateReExamination(id: number, reExaminationData: UpdateReExaminationRequest): Promise<ReExamination> {
    await connection.query('UPDATE Re_Examination SET ? WHERE re_exam_id = ?', [reExaminationData, id]);
    const reExamination = await getReExaminationById(id);
    if (!reExamination) {
        throw new Error(`Re-examination ${id} not found after update`);
    }
    return reExamination;
}

async function deleteReExamination(id: number): Promise<void> {
    await connection.query('DELETE FROM Re_Examination WHERE re_exam_id = ?', [id]);
}

export {
    getAllReExaminations,
    getReExaminationById,
    getReExaminationsByRecordId,
    createReExamination,
    updateReExamination,
    deleteReExamination
};
