import { Request, Response } from 'express';
import * as PrescriptionService from '../services/prescription.service';
import {
    CreatePrescriptionRequest,
    PrescriptionSearchFilters,
    PrescriptionSearchQuery,
    PrescriptionSortQuery,
    UpdatePrescriptionRequest
} from '../models/prescription.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import { parseId, parseNumber, parseOptionalId, parseOptionalNumber, parseOptionalString } from '../utils/validation.util';

const getAllPrescriptions = asyncHandler(
    async (req: Request<{}, unknown, unknown, PrescriptionSortQuery>, res: Response) => {
        const prescriptions = await PrescriptionService.getAllPrescriptions(req.query);
        return sendSuccess(res, 200, 'Prescriptions retrieved', prescriptions);
    }
);

const getPrescriptionById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const prescription = await PrescriptionService.getPrescriptionById(id);
    if (!prescription) {
        throw new HttpError(404, 'Prescription not found');
    }
    return sendSuccess(res, 200, 'Prescription retrieved', [prescription]);
});

const createPrescription = asyncHandler(
    async (req: Request<{}, unknown, CreatePrescriptionRequest>, res: Response) => {
        const payload: CreatePrescriptionRequest = {
            record_id: parseId(req.body.record_id, 'record_id'),
            medicine_id: parseId(req.body.medicine_id, 'medicine_id'),
            quantity: parseNumber(req.body.quantity, 'quantity')
        };
        const dosage = parseOptionalString(req.body.dosage, 'dosage');
        if (dosage !== undefined) payload.dosage = dosage;
        const usageInstructions = parseOptionalString(req.body.usage_instructions, 'usage_instructions');
        if (usageInstructions !== undefined) payload.usage_instructions = usageInstructions;
        const notes = parseOptionalString(req.body.notes, 'notes');
        if (notes !== undefined) payload.notes = notes;

        const prescription = await PrescriptionService.createPrescription(payload);
        return sendSuccess(res, 201, 'Prescription created', [prescription]);
    }
);

const updatePrescription = asyncHandler(
    async (req: Request<{ id: string }, unknown, UpdatePrescriptionRequest>, res: Response) => {
        const id = parseId(req.params.id, 'id');

        const payload: UpdatePrescriptionRequest = {};
        const medicineId = parseOptionalId(req.body.medicine_id, 'medicine_id');
        if (medicineId !== undefined) payload.medicine_id = medicineId;
        const quantity = parseOptionalNumber(req.body.quantity, 'quantity');
        if (quantity !== undefined) payload.quantity = quantity;
        const dosage = parseOptionalString(req.body.dosage, 'dosage');
        if (dosage !== undefined) payload.dosage = dosage;
        const usageInstructions = parseOptionalString(req.body.usage_instructions, 'usage_instructions');
        if (usageInstructions !== undefined) payload.usage_instructions = usageInstructions;
        const notes = parseOptionalString(req.body.notes, 'notes');
        if (notes !== undefined) payload.notes = notes;

        if (Object.values(payload).every((value) => value === undefined)) {
            throw new HttpError(400, 'No updatable fields provided');
        }

        const prescription = await PrescriptionService.updatePrescription(id, payload);
        if (!prescription) {
            throw new HttpError(404, 'Prescription not found');
        }
        return sendSuccess(res, 200, 'Prescription updated', [prescription]);
    }
);

const deletePrescription = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await PrescriptionService.deletePrescription(id);
    if (!deleted) {
        throw new HttpError(404, 'Prescription not found');
    }
    return sendSuccess(res, 200, 'Prescription deleted', []);
});

const searchPrescriptions = asyncHandler(
    async (req: Request<{}, unknown, unknown, PrescriptionSearchQuery>, res: Response) => {
        const filters: PrescriptionSearchFilters = {};
        if (req.query.recordId) filters.recordId = parseId(req.query.recordId, 'recordId');
        if (req.query.medicineId) filters.medicineId = parseId(req.query.medicineId, 'medicineId');
        const dosageFilter = parseOptionalString(req.query.dosage, 'dosage');
        if (dosageFilter !== undefined) filters.dosage = dosageFilter;
        const usageInstructionsFilter = parseOptionalString(req.query.usageInstructions, 'usageInstructions');
        if (usageInstructionsFilter !== undefined) filters.usageInstructions = usageInstructionsFilter;

        const prescriptions = await PrescriptionService.searchPrescriptions(filters);
        return sendSuccess(res, 200, 'Prescriptions retrieved', prescriptions);
    }
);

export {
    getAllPrescriptions,
    getPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription,
    searchPrescriptions
};
