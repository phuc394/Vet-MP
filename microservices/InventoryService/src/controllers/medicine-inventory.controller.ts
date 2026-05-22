import { Request, RequestHandler, Response } from 'express';
import * as MedicineInventoryService from '../services/medicine-inventory.service';
import {
    CreateMedicineInventoryRequest,
    MedicineInventorySearchFilters,
    MedicineInventorySearchQuery,
    MedicineInventorySortQuery,
    UpdateMedicineInventoryRequest
} from '../models/medicine-inventory.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import { parseId, parseOptionalBoolean, parseOptionalNumber } from '../utils/validation.util';

const getAllMedicineInventory: RequestHandler<{}, unknown, unknown, MedicineInventorySortQuery> = asyncHandler(
    async (req: Request<{}, unknown, unknown, MedicineInventorySortQuery>, res: Response) => {
        const inventory = await MedicineInventoryService.getAllMedicineInventory(req.query);
        return sendSuccess(res, 200, 'Medicine inventory retrieved', inventory);
    }
);

const getMedicineInventoryById: RequestHandler<{ id: string }> = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const inventory = await MedicineInventoryService.getMedicineInventoryById(id);
    if (!inventory) {
        throw new HttpError(404, 'Medicine inventory not found');
    }
    return sendSuccess(res, 200, 'Medicine inventory retrieved', [inventory]);
});

const createMedicineInventory: RequestHandler<{}, unknown, CreateMedicineInventoryRequest> = asyncHandler(
    async (req: Request<{}, unknown, CreateMedicineInventoryRequest>, res: Response) => {
        const payload: CreateMedicineInventoryRequest = {
            medicine_id: parseId(req.body.medicine_id, 'medicine_id')
        };
        const importPrice = parseOptionalNumber(req.body.import_price, 'import_price');
        if (importPrice !== undefined) payload.import_price = importPrice;
        const availableStock = parseOptionalNumber(req.body.available_stock, 'available_stock');
        if (availableStock !== undefined) payload.available_stock = availableStock;
        const minThreshold = parseOptionalNumber(req.body.min_threshold, 'min_threshold');
        if (minThreshold !== undefined) payload.min_threshold = minThreshold;

        const inventory = await MedicineInventoryService.createMedicineInventory(payload);
        return sendSuccess(res, 201, 'Medicine inventory created', [inventory]);
    }
);

const updateMedicineInventory: RequestHandler<{ id: string }, unknown, UpdateMedicineInventoryRequest> = asyncHandler(
    async (req: Request<{ id: string }, unknown, UpdateMedicineInventoryRequest>, res: Response) => {
        const id = parseId(req.params.id, 'id');

        const payload: UpdateMedicineInventoryRequest = {};
        const importPrice = parseOptionalNumber(req.body.import_price, 'import_price');
        if (importPrice !== undefined) payload.import_price = importPrice;
        const availableStock = parseOptionalNumber(req.body.available_stock, 'available_stock');
        if (availableStock !== undefined) payload.available_stock = availableStock;
        const minThreshold = parseOptionalNumber(req.body.min_threshold, 'min_threshold');
        if (minThreshold !== undefined) payload.min_threshold = minThreshold;

        if (Object.values(payload).every((value) => value === undefined)) {
            throw new HttpError(400, 'No updatable fields provided');
        }

        const inventory = await MedicineInventoryService.updateMedicineInventory(id, payload);
        if (!inventory) {
            throw new HttpError(404, 'Medicine inventory not found');
        }
        return sendSuccess(res, 200, 'Medicine inventory updated', [inventory]);
    }
);

const deleteMedicineInventory: RequestHandler<{ id: string }> = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await MedicineInventoryService.deleteMedicineInventory(id);
    if (!deleted) {
        throw new HttpError(404, 'Medicine inventory not found');
    }
    return sendSuccess(res, 200, 'Medicine inventory deleted', []);
});

const searchMedicineInventory: RequestHandler<{}, unknown, unknown, MedicineInventorySearchQuery> = asyncHandler(
    async (req: Request<{}, unknown, unknown, MedicineInventorySearchQuery>, res: Response) => {
        const filters: MedicineInventorySearchFilters = {};
        if (req.query.medicineId) {
            filters.medicineId = parseId(req.query.medicineId, 'medicineId');
        }
        const minStock = parseOptionalNumber(req.query.minStock, 'minStock');
        if (minStock !== undefined) filters.minStock = minStock;
        const maxStock = parseOptionalNumber(req.query.maxStock, 'maxStock');
        if (maxStock !== undefined) filters.maxStock = maxStock;
        const belowThreshold = parseOptionalBoolean(req.query.belowThreshold, 'belowThreshold');
        if (belowThreshold !== undefined) filters.belowThreshold = belowThreshold;

        const inventory = await MedicineInventoryService.searchMedicineInventory(filters);
        return sendSuccess(res, 200, 'Medicine inventory retrieved', inventory);
    }
);

export {
    getAllMedicineInventory,
    getMedicineInventoryById,
    createMedicineInventory,
    updateMedicineInventory,
    deleteMedicineInventory,
    searchMedicineInventory
};
