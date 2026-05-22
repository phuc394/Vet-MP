import { Request, RequestHandler, Response } from 'express';
import * as SupplierService from '../services/supplier.service';
import {
    CreateSupplierRequest,
    SupplierSearchFilters,
    SupplierSearchQuery,
    SupplierSortQuery,
    UpdateSupplierRequest
} from '../models/supplier.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import { parseId, parseOptionalString, parseString } from '../utils/validation.util';

const getAllSuppliers: RequestHandler<{}, unknown, unknown, SupplierSortQuery> = asyncHandler(async (req: Request<{}, unknown, unknown, SupplierSortQuery>, res: Response) => {
    const suppliers = await SupplierService.getAllSuppliers(req.query);
    return sendSuccess(res, 200, 'Suppliers retrieved', suppliers);
});

const getSupplierById: RequestHandler<{ id: string }> = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const supplier = await SupplierService.getSupplierById(id);
    if (!supplier) {
        throw new HttpError(404, 'Supplier not found');
    }
    return sendSuccess(res, 200, 'Supplier retrieved', [supplier]);
});

const createSupplier: RequestHandler<{}, unknown, CreateSupplierRequest> = asyncHandler(async (req: Request<{}, unknown, CreateSupplierRequest>, res: Response) => {
    const payload: CreateSupplierRequest = {
        name: parseString(req.body.name, 'name')
    };
    const contactInfo = parseOptionalString(req.body.contact_info, 'contact_info');
    if (contactInfo !== undefined) payload.contact_info = contactInfo;
    const address = parseOptionalString(req.body.address, 'address');
    if (address !== undefined) payload.address = address;

    const supplier = await SupplierService.createSupplier(payload);
    return sendSuccess(res, 201, 'Supplier created', [supplier]);
});

const updateSupplier: RequestHandler<{ id: string }, unknown, UpdateSupplierRequest> = asyncHandler(async (req: Request<{ id: string }, unknown, UpdateSupplierRequest>, res: Response) => {
    const id = parseId(req.params.id, 'id');

    const payload: UpdateSupplierRequest = {};
    const name = parseOptionalString(req.body.name, 'name');
    if (name !== undefined) payload.name = name;
    const contactInfoUpdate = parseOptionalString(req.body.contact_info, 'contact_info');
    if (contactInfoUpdate !== undefined) payload.contact_info = contactInfoUpdate;
    const addressUpdate = parseOptionalString(req.body.address, 'address');
    if (addressUpdate !== undefined) payload.address = addressUpdate;

    if (Object.values(payload).every((value) => value === undefined)) {
        throw new HttpError(400, 'No updatable fields provided');
    }

    const supplier = await SupplierService.updateSupplier(id, payload);
    if (!supplier) {
        throw new HttpError(404, 'Supplier not found');
    }
    return sendSuccess(res, 200, 'Supplier updated', [supplier]);
});

const deleteSupplier: RequestHandler<{ id: string }> = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await SupplierService.deleteSupplier(id);
    if (!deleted) {
        throw new HttpError(404, 'Supplier not found');
    }
    return sendSuccess(res, 200, 'Supplier deleted', []);
});

const searchSuppliers: RequestHandler<{}, unknown, unknown, SupplierSearchQuery> = asyncHandler(
    async (req: Request<{}, unknown, unknown, SupplierSearchQuery>, res: Response) => {
        const filters: SupplierSearchFilters = {};
        const nameFilter = parseOptionalString(req.query.name, 'name');
        if (nameFilter !== undefined) filters.name = nameFilter;
        const contactInfoFilter = parseOptionalString(req.query.contactInfo, 'contactInfo');
        if (contactInfoFilter !== undefined) filters.contactInfo = contactInfoFilter;
        const addressFilter = parseOptionalString(req.query.address, 'address');
        if (addressFilter !== undefined) filters.address = addressFilter;

        const suppliers = await SupplierService.searchSuppliers(filters);
        return sendSuccess(res, 200, 'Suppliers retrieved', suppliers);
    }
);

export { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier, searchSuppliers };
