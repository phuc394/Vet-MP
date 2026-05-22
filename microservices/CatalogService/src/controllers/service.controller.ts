import { Request, Response } from 'express';
import * as CatalogService from '../services/service.service';
import {
    CreateServiceRequest,
    ServiceSearchFilters,
    ServiceSearchQuery,
    ServiceSortQuery,
    UpdateServiceRequest
} from '../models/service.model';
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

const getAllServices = asyncHandler(
    async (req: Request<{}, unknown, unknown, ServiceSortQuery>, res: Response) => {
        const services = await CatalogService.getAllServices(req.query);
        return sendSuccess(res, 200, 'Services retrieved', services);
    }
);

const getServiceById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const service = await CatalogService.getServiceById(id);
    if (!service) {
        throw new HttpError(404, 'Service not found');
    }
    return sendSuccess(res, 200, 'Service retrieved', [service]);
});

const createService = asyncHandler(async (req: Request<{}, unknown, CreateServiceRequest>, res: Response) => {
    const payload: CreateServiceRequest = {
        name: parseString(req.body.name, 'name'),
        price: parseNumber(req.body.price, 'price'),
        is_active: parseBoolean(req.body.is_active, 'is_active')
    };
    const description = parseOptionalString(req.body.description, 'description');
    if (description !== undefined) payload.description = description;

    const service = await CatalogService.createService(payload);
    return sendSuccess(res, 201, 'Service created', [service]);
});

const updateService = asyncHandler(async (req: Request<{ id: string }, unknown, UpdateServiceRequest>, res: Response) => {
    const id = parseId(req.params.id, 'id');

    const payload: UpdateServiceRequest = {};
    const name = parseOptionalString(req.body.name, 'name');
    if (name !== undefined) payload.name = name;
    const description = parseOptionalString(req.body.description, 'description');
    if (description !== undefined) payload.description = description;
    const price = parseOptionalNumber(req.body.price, 'price');
    if (price !== undefined) payload.price = price;
    const isActive = parseOptionalBoolean(req.body.is_active, 'is_active');
    if (isActive !== undefined) payload.is_active = isActive;

    if (Object.values(payload).every((value) => value === undefined)) {
        throw new HttpError(400, 'No updatable fields provided');
    }

    const service = await CatalogService.updateService(id, payload);
    if (!service) {
        throw new HttpError(404, 'Service not found');
    }
    return sendSuccess(res, 200, 'Service updated', [service]);
});

const deleteService = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const deleted = await CatalogService.deleteService(id);
    if (!deleted) {
        throw new HttpError(404, 'Service not found');
    }
    return sendSuccess(res, 200, 'Service deleted', []);
});

const searchServices = asyncHandler(
    async (req: Request<{}, unknown, unknown, ServiceSearchQuery>, res: Response) => {
        const filters: ServiceSearchFilters = {};
        const nameFilter = parseOptionalString(req.query.name, 'name');
        if (nameFilter !== undefined) filters.name = nameFilter;
        const descriptionFilter = parseOptionalString(req.query.description, 'description');
        if (descriptionFilter !== undefined) filters.description = descriptionFilter;
        const isActiveFilter = parseOptionalBoolean(req.query.isActive, 'isActive');
        if (isActiveFilter !== undefined) filters.isActive = isActiveFilter;

        const services = await CatalogService.searchServices(filters);
        return sendSuccess(res, 200, 'Services retrieved', services);
    }
);

export {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    searchServices
};
