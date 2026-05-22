import connection from '../config/database.config';
import {
    CreateReExaminationRequest,
    ReExamination,
    ReExaminationSearchFilters,
    ReExaminationSortQuery,
    SortOrder,
    UpdateReExaminationRequest
} from '../models/re-examination.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = ['re_exam_id', 'record_id', 'suggested_date', 'reason', 'is_booked', 'created_at'];
const DATE_FIELDS = ['suggested_date', 'created_at'];
const DEFAULT_SORT_BY = 'suggested_date';

function resolveSort(query?: ReExaminationSortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
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

async function getAllReExaminations(sortQuery?: ReExaminationSortQuery): Promise<ReExamination[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Re_Examination ORDER BY ${sortBy} ${order}`);
    return rows as ReExamination[];
}

async function getReExaminationById(id: number): Promise<ReExamination | null> {
    const [rows] = await connection.query('SELECT * FROM Re_Examination WHERE re_exam_id = ?', [id]);
    const reExaminations = rows as ReExamination[];
    return reExaminations.length > 0 ? reExaminations[0] ?? null : null;
}

async function createReExamination(reExaminationData: CreateReExaminationRequest): Promise<ReExamination> {
    const reExamination: Omit<ReExamination, 're_exam_id'> = {
        record_id: reExaminationData.record_id,
        suggested_date: reExaminationData.suggested_date,
        reason: reExaminationData.reason,
        is_booked: reExaminationData.is_booked,
        created_at: new Date()
    };

    const [result] = await connection.query('INSERT INTO Re_Examination SET ?', [reExamination]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...reExamination, re_exam_id: insertId };
}

async function updateReExamination(id: number, reExaminationData: UpdateReExaminationRequest): Promise<ReExamination | null> {
    const updateData = Object.fromEntries(Object.entries(reExaminationData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData
    };

    const [result] = await connection.query('UPDATE Re_Examination SET ? WHERE re_exam_id = ?', [payload, id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getReExaminationById(id);
}

async function deleteReExamination(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Re_Examination WHERE re_exam_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchReExaminations(filters: ReExaminationSearchFilters): Promise<ReExamination[]> {
    let sql = 'SELECT * FROM Re_Examination WHERE 1=1';
    const params: Array<number | boolean | Date> = [];

    if (filters.recordId !== undefined) {
        sql += ' AND record_id = ?';
        params.push(filters.recordId);
    }

    if (filters.isBooked !== undefined) {
        sql += ' AND is_booked = ?';
        params.push(filters.isBooked);
    }

    if (filters.startDate && filters.endDate) {
        sql += ' AND suggested_date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
        sql += ' AND suggested_date >= ?';
        params.push(filters.startDate);
    } else if (filters.endDate) {
        sql += ' AND suggested_date <= ?';
        params.push(filters.endDate);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return rows as ReExamination[];
}

export {
    getAllReExaminations,
    getReExaminationById,
    createReExamination,
    updateReExamination,
    deleteReExamination,
    searchReExaminations
};
