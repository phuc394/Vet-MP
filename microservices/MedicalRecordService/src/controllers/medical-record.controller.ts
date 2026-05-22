import { Request, Response } from 'express';
import * as MedicalRecordService from '../services/medical-record.service';
import {
    CreateMedicalRecordRequest,
    MedicalRecordSearchFilters,
    MedicalRecordSearchQuery,
    MedicalRecordSortQuery,
    UpdateMedicalRecordRequest
} from '../models/medical-record.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import { parseId, parseOptionalString } from '../utils/validation.util';

const getAllMedicalRecords = asyncHandler(
    async (req: Request<{}, unknown, unknown, MedicalRecordSortQuery>, res: Response) => {
        const records = await MedicalRecordService.getAllMedicalRecords(req.query);
        return sendSuccess(res, 200, 'Medical records retrieved', records);
    }
);

const getMedicalRecordById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const record = await MedicalRecordService.getMedicalRecordById(id);
    if (!record) {
        throw new HttpError(404, 'Medical record not found');
    }
    return sendSuccess(res, 200, 'Medical record retrieved', [record]);
});

const createMedicalRecord = asyncHandler(
    async (req: Request<{}, unknown, CreateMedicalRecordRequest>, res: Response) => {
        const payload: CreateMedicalRecordRequest = {
            appointment_id: parseId(req.body.appointment_id, 'appointment_id')
        };
        const symptoms = parseOptionalString(req.body.symptoms, 'symptoms');
        if (symptoms !== undefined) payload.symptoms = symptoms;
        const diagnosis = parseOptionalString(req.body.diagnosis, 'diagnosis');
        if (diagnosis !== undefined) payload.diagnosis = diagnosis;
        const notes = parseOptionalString(req.body.notes, 'notes');
        if (notes !== undefined) payload.notes = notes;
        const status = parseOptionalString(req.body.status, 'status');
        if (status !== undefined) payload.status = MedicalRecordService.resolveMedicalRecordStatus(status);

        const record = await MedicalRecordService.createMedicalRecord(payload);
        return sendSuccess(res, 201, 'Medical record created', [record]);
    }
);

const updateMedicalRecord = asyncHandler(
    async (req: Request<{ id: string }, unknown, UpdateMedicalRecordRequest>, res: Response) => {
        const id = parseId(req.params.id, 'id');

        const payload: UpdateMedicalRecordRequest = {};
        const symptoms = parseOptionalString(req.body.symptoms, 'symptoms');
        if (symptoms !== undefined) payload.symptoms = symptoms;
        const diagnosis = parseOptionalString(req.body.diagnosis, 'diagnosis');
        if (diagnosis !== undefined) payload.diagnosis = diagnosis;
        const notes = parseOptionalString(req.body.notes, 'notes');
        if (notes !== undefined) payload.notes = notes;
        const status = parseOptionalString(req.body.status, 'status');
        if (status !== undefined) payload.status = MedicalRecordService.resolveMedicalRecordStatus(status);

        if (Object.values(payload).every((value) => value === undefined)) {
            throw new HttpError(400, 'No updatable fields provided');
        }

        const record = await MedicalRecordService.updateMedicalRecord(id, payload);
        if (!record) {
            throw new HttpError(404, 'Medical record not found');
        }
        return sendSuccess(res, 200, 'Medical record updated', [record]);
    }
);

const deleteMedicalRecord = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await MedicalRecordService.deleteMedicalRecord(id);
    if (!deleted) {
        throw new HttpError(404, 'Medical record not found');
    }
    return sendSuccess(res, 200, 'Medical record deleted', []);
});

const searchMedicalRecords = asyncHandler(
    async (req: Request<{}, unknown, unknown, MedicalRecordSearchQuery>, res: Response) => {
        const filters: MedicalRecordSearchFilters = {};
        if (req.query.appointmentId) {
            filters.appointmentId = parseId(req.query.appointmentId, 'appointmentId');
        }
        const symptomsFilter = parseOptionalString(req.query.symptoms, 'symptoms');
        if (symptomsFilter !== undefined) filters.symptoms = symptomsFilter;
        const diagnosisFilter = parseOptionalString(req.query.diagnosis, 'diagnosis');
        if (diagnosisFilter !== undefined) filters.diagnosis = diagnosisFilter;
        const statusFilter = parseOptionalString(req.query.status, 'status');
        if (statusFilter !== undefined) filters.status = MedicalRecordService.resolveMedicalRecordStatus(statusFilter);

        const records = await MedicalRecordService.searchMedicalRecords(filters);
        return sendSuccess(res, 200, 'Medical records retrieved', records);
    }
);

export {
    getAllMedicalRecords,
    getMedicalRecordById,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    searchMedicalRecords
};
