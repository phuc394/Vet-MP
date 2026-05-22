import { Request, RequestHandler, Response } from 'express';
import * as InventoryTransactionService from '../services/inventory-transaction.service';
import {
    CreateInventoryTransactionRequest,
    InventoryTransactionSearchFilters,
    InventoryTransactionSearchQuery,
    InventoryTransactionSortQuery,
    UpdateInventoryTransactionRequest
} from '../models/inventory-transaction.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import {
    parseDate,
    parseId,
    parseNumber,
    parseOptionalDate,
    parseOptionalId,
    parseOptionalNumber,
    parseOptionalString,
    parseString
} from '../utils/validation.util';

const getAllInventoryTransactions: RequestHandler<{}, unknown, unknown, InventoryTransactionSortQuery> = asyncHandler(
    async (req: Request<{}, unknown, unknown, InventoryTransactionSortQuery>, res: Response) => {
        const transactions = await InventoryTransactionService.getAllInventoryTransactions(req.query);
        return sendSuccess(res, 200, 'Inventory transactions retrieved', transactions);
    }
);

const getInventoryTransactionById: RequestHandler<{ id: string }> = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const transaction = await InventoryTransactionService.getInventoryTransactionById(id);
    if (!transaction) {
        throw new HttpError(404, 'Inventory transaction not found');
    }
    return sendSuccess(res, 200, 'Inventory transaction retrieved', [transaction]);
});

const createInventoryTransaction: RequestHandler<{}, unknown, CreateInventoryTransactionRequest> = asyncHandler(
    async (req: Request<{}, unknown, CreateInventoryTransactionRequest>, res: Response) => {
        const transactionType = parseString(req.body.transaction_type, 'transaction_type');
        const payload: CreateInventoryTransactionRequest = {
            medicine_id: parseId(req.body.medicine_id, 'medicine_id'),
            transaction_type: InventoryTransactionService.resolveTransactionType(transactionType),
            quantity: parseNumber(req.body.quantity, 'quantity'),
            transaction_date: parseDate(req.body.transaction_date, 'transaction_date'),
            created_by: parseId(req.body.created_by, 'created_by')
        };
        const supplierId = parseOptionalId(req.body.supplier_id, 'supplier_id');
        if (supplierId !== undefined) payload.supplier_id = supplierId;
        const referenceId = parseOptionalId(req.body.reference_id, 'reference_id');
        if (referenceId !== undefined) payload.reference_id = referenceId;
        const notes = parseOptionalString(req.body.notes, 'notes');
        if (notes !== undefined) payload.notes = notes;

        const transaction = await InventoryTransactionService.createInventoryTransaction(payload);
        return sendSuccess(res, 201, 'Inventory transaction created', [transaction]);
    }
);

const updateInventoryTransaction: RequestHandler<{ id: string }, unknown, UpdateInventoryTransactionRequest> = asyncHandler(
    async (req: Request<{ id: string }, unknown, UpdateInventoryTransactionRequest>, res: Response) => {
        const id = parseId(req.params.id, 'id');
        const transactionType = parseOptionalString(req.body.transaction_type, 'transaction_type');

        const payload: UpdateInventoryTransactionRequest = {};
        const medicineId = parseOptionalId(req.body.medicine_id, 'medicine_id');
        if (medicineId !== undefined) payload.medicine_id = medicineId;
        if (transactionType) {
            payload.transaction_type = InventoryTransactionService.resolveTransactionType(transactionType);
        }
        const quantity = parseOptionalNumber(req.body.quantity, 'quantity');
        if (quantity !== undefined) payload.quantity = quantity;
        const transactionDate = parseOptionalDate(req.body.transaction_date, 'transaction_date');
        if (transactionDate !== undefined) payload.transaction_date = transactionDate;
        const supplierIdUpdate = parseOptionalId(req.body.supplier_id, 'supplier_id');
        if (supplierIdUpdate !== undefined) payload.supplier_id = supplierIdUpdate;
        const referenceIdUpdate = parseOptionalId(req.body.reference_id, 'reference_id');
        if (referenceIdUpdate !== undefined) payload.reference_id = referenceIdUpdate;
        const createdBy = parseOptionalId(req.body.created_by, 'created_by');
        if (createdBy !== undefined) payload.created_by = createdBy;
        const notesUpdate = parseOptionalString(req.body.notes, 'notes');
        if (notesUpdate !== undefined) payload.notes = notesUpdate;

        if (Object.values(payload).every((value) => value === undefined)) {
            throw new HttpError(400, 'No updatable fields provided');
        }

        const transaction = await InventoryTransactionService.updateInventoryTransaction(id, payload);
        if (!transaction) {
            throw new HttpError(404, 'Inventory transaction not found');
        }
        return sendSuccess(res, 200, 'Inventory transaction updated', [transaction]);
    }
);

const deleteInventoryTransaction: RequestHandler<{ id: string }> = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await InventoryTransactionService.deleteInventoryTransaction(id);
    if (!deleted) {
        throw new HttpError(404, 'Inventory transaction not found');
    }
    return sendSuccess(res, 200, 'Inventory transaction deleted', []);
});

const searchInventoryTransactions: RequestHandler<{}, unknown, unknown, InventoryTransactionSearchQuery> = asyncHandler(
    async (req: Request<{}, unknown, unknown, InventoryTransactionSearchQuery>, res: Response) => {
        const transactionType = parseOptionalString(req.query.transactionType, 'transactionType');
        const filters: InventoryTransactionSearchFilters = {};
        if (req.query.medicineId) filters.medicineId = parseId(req.query.medicineId, 'medicineId');
        if (req.query.supplierId) filters.supplierId = parseId(req.query.supplierId, 'supplierId');
        if (transactionType) {
            filters.transactionType = InventoryTransactionService.resolveTransactionType(transactionType);
        }
        const startDate = parseOptionalDate(req.query.startDate, 'startDate');
        if (startDate !== undefined) filters.startDate = startDate;
        const endDate = parseOptionalDate(req.query.endDate, 'endDate');
        if (endDate !== undefined) filters.endDate = endDate;
        if (req.query.createdBy) filters.createdBy = parseId(req.query.createdBy, 'createdBy');

        const transactions = await InventoryTransactionService.searchInventoryTransactions(filters);
        return sendSuccess(res, 200, 'Inventory transactions retrieved', transactions);
    }
);

export {
    getAllInventoryTransactions,
    getInventoryTransactionById,
    createInventoryTransaction,
    updateInventoryTransaction,
    deleteInventoryTransaction,
    searchInventoryTransactions
};
