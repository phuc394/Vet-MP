const connection = require('../config/database');
import { ReExamination, CreateReExaminationRequest, UpdateReExaminationRequest } from '../models/ReExaminationModel';

async function getAllReExaminations(): Promise<ReExamination[]> {
    const result = await connection.query('SELECT * FROM Re_Examination');
    return result;
}

async function getReExaminationById(id: number): Promise<ReExamination | null> {
    const result = await connection.query('SELECT * FROM Re_Examination WHERE re_exam_id = ?', [id]);
    return result.length > 0 ? result[0] : null;
}

async function getReExaminationsByRecordId(recordId: number): Promise<ReExamination[]> {
    const result = await connection.query('SELECT * FROM Re_Examination WHERE record_id = ?', [recordId]);
    return result;
}

async function createReExamination(reExaminationData: CreateReExaminationRequest): Promise<ReExamination> {
    const reExamination: Omit<ReExamination, 're_exam_id'> = {
        record_id: reExaminationData.record_id,
        suggested_date: reExaminationData.suggested_date,
        reason: reExaminationData.reason,
        is_booked: reExaminationData.is_booked,
        created_at: new Date()
    };
    
    const result = await connection.query('INSERT INTO Re_Examination SET ?', reExamination);
    return result;
}

async function updateReExamination(id: number, reExaminationData: UpdateReExaminationRequest): Promise<ReExamination> {
    const result = await connection.query('UPDATE Re_Examination SET ? WHERE re_exam_id = ?', [reExaminationData, id]);
    return result;
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
