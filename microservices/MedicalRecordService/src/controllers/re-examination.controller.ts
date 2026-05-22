import { Request, Response } from 'express';
import * as ReExaminationService from '../services/re-examination.service';
import {
    CreateReExaminationRequest,
    ReExaminationSearchFilters,
    ReExaminationSearchQuery,
    ReExaminationSortQuery,
    UpdateReExaminationRequest
} from '../models/re-examination.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import {
    parseBoolean,
    parseDate,
    parseId,
    parseOptionalBoolean,
    parseOptionalDate,
    parseOptionalString,
    parseString
} from '../utils/validation.util';

const getAllReExaminations = asyncHandler(
    async (req: Request<{}, unknown, unknown, ReExaminationSortQuery>, res: Response) => {
        const reExaminations = await ReExaminationService.getAllReExaminations(req.query);
        return sendSuccess(res, 200, 'Re-examinations retrieved', reExaminations);
    }
);

const getReExaminationById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const reExamination = await ReExaminationService.getReExaminationById(id);
    if (!reExamination) {
        throw new HttpError(404, 'Re-examination not found');
    }
    return sendSuccess(res, 200, 'Re-examination retrieved', [reExamination]);
});

const createReExamination = asyncHandler(
    async (req: Request<{}, unknown, CreateReExaminationRequest>, res: Response) => {
        const payload: CreateReExaminationRequest = {
            record_id: parseId(req.body.record_id, 'record_id'),
            suggested_date: parseDate(req.body.suggested_date, 'suggested_date'),
            reason: parseString(req.body.reason, 'reason'),
            is_booked: parseBoolean(req.body.is_booked, 'is_booked')
        };

        const reExamination = await ReExaminationService.createReExamination(payload);
        return sendSuccess(res, 201, 'Re-examination created', [reExamination]);
    }
);

const updateReExamination = asyncHandler(
    async (req: Request<{ id: string }, unknown, UpdateReExaminationRequest>, res: Response) => {
        const id = parseId(req.params.id, 'id');

        const payload: UpdateReExaminationRequest = {};
        const suggestedDate = parseOptionalDate(req.body.suggested_date, 'suggested_date');
        if (suggestedDate !== undefined) payload.suggested_date = suggestedDate;
        const reason = parseOptionalString(req.body.reason, 'reason');
        if (reason !== undefined) payload.reason = reason;
        const isBooked = parseOptionalBoolean(req.body.is_booked, 'is_booked');
        if (isBooked !== undefined) payload.is_booked = isBooked;

        if (Object.values(payload).every((value) => value === undefined)) {
            throw new HttpError(400, 'No updatable fields provided');
        }

        const reExamination = await ReExaminationService.updateReExamination(id, payload);
        if (!reExamination) {
            throw new HttpError(404, 'Re-examination not found');
        }
        return sendSuccess(res, 200, 'Re-examination updated', [reExamination]);
    }
);

const deleteReExamination = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await ReExaminationService.deleteReExamination(id);
    if (!deleted) {
        throw new HttpError(404, 'Re-examination not found');
    }
    return sendSuccess(res, 200, 'Re-examination deleted', []);
});

const searchReExaminations = asyncHandler(
    async (req: Request<{}, unknown, unknown, ReExaminationSearchQuery>, res: Response) => {
        const filters: ReExaminationSearchFilters = {};
        if (req.query.recordId) filters.recordId = parseId(req.query.recordId, 'recordId');
        const isBookedFilter = parseOptionalBoolean(req.query.isBooked, 'isBooked');
        if (isBookedFilter !== undefined) filters.isBooked = isBookedFilter;
        const startDate = parseOptionalDate(req.query.startDate, 'startDate');
        if (startDate !== undefined) filters.startDate = startDate;
        const endDate = parseOptionalDate(req.query.endDate, 'endDate');
        if (endDate !== undefined) filters.endDate = endDate;

        const reExaminations = await ReExaminationService.searchReExaminations(filters);
        return sendSuccess(res, 200, 'Re-examinations retrieved', reExaminations);
    }
);

export {
    getAllReExaminations,
    getReExaminationById,
    createReExamination,
    updateReExamination,
    deleteReExamination,
    searchReExaminations
};
