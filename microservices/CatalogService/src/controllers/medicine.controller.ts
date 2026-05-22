import { Request, Response } from 'express';
import * as MedicineService from '../services/medicine.service';
import {
    CreateMedicineRequest,
    MedicineSearchFilters,
    MedicineSearchQuery,
    MedicineSortQuery,
    UpdateMedicineRequest
} from '../models/medicine.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import {
    parseBoolean,
    parseId,
    parseNumber,
    parseOptionalBoolean,
    parseOptionalNumber,
    parseOptionalString,
    parseString
} from '../utils/validation.util';

const getAllMedicines = asyncHandler(
    async (req: Request<{}, unknown, unknown, MedicineSortQuery>, res: Response) => {
        const medicines = await MedicineService.getAllMedicines(req.query);
        return sendSuccess(res, 200, 'Medicines retrieved', medicines);
    }
);

const getMedicineById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const medicine = await MedicineService.getMedicineById(id);
    if (!medicine) {
        throw new HttpError(404, 'Medicine not found');
    }
    return sendSuccess(res, 200, 'Medicine retrieved', [medicine]);
});

const createMedicine = asyncHandler(async (req: Request<{}, unknown, CreateMedicineRequest>, res: Response) => {
    const payload: CreateMedicineRequest = {
        name: parseString(req.body.name, 'name'),
        unit: parseString(req.body.unit, 'unit'),
        selling_price: parseNumber(req.body.selling_price, 'selling_price'),
        is_active: parseBoolean(req.body.is_active, 'is_active')
    };
    const ingredients = parseOptionalString(req.body.ingredients, 'ingredients');
    if (ingredients !== undefined) payload.ingredients = ingredients;

    const medicine = await MedicineService.createMedicine(payload);
    return sendSuccess(res, 201, 'Medicine created', [medicine]);
});

const updateMedicine = asyncHandler(async (req: Request<{ id: string }, unknown, UpdateMedicineRequest>, res: Response) => {
    const id = parseId(req.params.id, 'id');

    const payload: UpdateMedicineRequest = {};
    const name = parseOptionalString(req.body.name, 'name');
    if (name !== undefined) payload.name = name;
    const unit = parseOptionalString(req.body.unit, 'unit');
    if (unit !== undefined) payload.unit = unit;
    const sellingPrice = parseOptionalNumber(req.body.selling_price, 'selling_price');
    if (sellingPrice !== undefined) payload.selling_price = sellingPrice;
    const ingredients = parseOptionalString(req.body.ingredients, 'ingredients');
    if (ingredients !== undefined) payload.ingredients = ingredients;
    const isActive = parseOptionalBoolean(req.body.is_active, 'is_active');
    if (isActive !== undefined) payload.is_active = isActive;

    if (Object.values(payload).every((value) => value === undefined)) {
        throw new HttpError(400, 'No updatable fields provided');
    }

    const medicine = await MedicineService.updateMedicine(id, payload);
    if (!medicine) {
        throw new HttpError(404, 'Medicine not found');
    }
    return sendSuccess(res, 200, 'Medicine updated', [medicine]);
});

const deleteMedicine = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await MedicineService.deleteMedicine(id);
    if (!deleted) {
        throw new HttpError(404, 'Medicine not found');
    }
    return sendSuccess(res, 200, 'Medicine deleted', []);
});

const searchMedicines = asyncHandler(
    async (req: Request<{}, unknown, unknown, MedicineSearchQuery>, res: Response) => {
        const filters: MedicineSearchFilters = {};
        const nameFilter = parseOptionalString(req.query.name, 'name');
        if (nameFilter !== undefined) filters.name = nameFilter;
        const ingredientsFilter = parseOptionalString(req.query.ingredients, 'ingredients');
        if (ingredientsFilter !== undefined) filters.ingredients = ingredientsFilter;
        const isActiveFilter = parseOptionalBoolean(req.query.isActive, 'isActive');
        if (isActiveFilter !== undefined) filters.isActive = isActiveFilter;

        const medicines = await MedicineService.searchMedicines(filters);
        return sendSuccess(res, 200, 'Medicines retrieved', medicines);
    }
);

export {
    getAllMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines
};
