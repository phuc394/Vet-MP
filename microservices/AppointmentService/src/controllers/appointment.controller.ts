import { Request, Response } from 'express';
import * as AppointmentService from '../services/appointment.service';
import {
    AppointmentSearchFilters,
    AppointmentSearchQuery,
    AppointmentSortQuery,
    CreateAppointmentRequest,
    UpdateAppointmentRequest
} from '../models/appointment.model';
import { asyncHandler } from '../utils/async-handler.util';
import { HttpError } from '../utils/error.util';
import { sendSuccess } from '../utils/response.util';
import {
    parseDate,
    parseId,
    parseOptionalId,
    parseNumber,
    parseOptionalDate,
    parseOptionalNumber,
    parseOptionalString,
    parseString
} from '../utils/validation.util';

const getAllAppointments = asyncHandler(
    async (req: Request<{}, unknown, unknown, AppointmentSortQuery>, res: Response) => {
        const user = (req as any).user;
        const appointments = user.role === 'admin'
            ? await AppointmentService.getAllAppointments(req.query)
            : await AppointmentService.getAppointmentsByOwnerId(user.user_id, req.query);
        return sendSuccess(res, 200, 'Appointments retrieved', appointments);
    }
);

const getAppointmentById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const appointment = await AppointmentService.getAppointmentById(id);
    if (!appointment) {
        throw new HttpError(404, 'Appointment not found');
    }
    const user = (req as any).user;
    if (
        user.role !== 'admin' &&
        !await AppointmentService.isAppointmentOwnedByUser(id, user.user_id)
    ) {
        throw new HttpError(403, 'Forbidden');
    }
    return sendSuccess(res, 200, 'Appointment retrieved', [appointment]);
});

const createAppointment = asyncHandler(async (req: Request<{}, unknown, CreateAppointmentRequest>, res: Response) => {
    const payload: CreateAppointmentRequest = {
        pet_id: parseId(req.body.pet_id, 'pet_id'),
        service_id: parseId(req.body.service_id, 'service_id'),
        appointment_date: parseDate(req.body.appointment_date, 'appointment_date'),
        start_time: parseDate(req.body.start_time, 'start_time'),
        end_time: parseDate(req.body.end_time, 'end_time'),
        service_price: parseNumber(req.body.service_price, 'service_price')
    };
    const staffId = parseOptionalId(req.body.staff_id, 'staff_id');
    if (staffId !== undefined) payload.staff_id = staffId;
    const note = parseOptionalString(req.body.note, 'note');
    if (note !== undefined) payload.note = note;

    const user = (req as any).user;
    if (
        user.role !== 'admin' &&
        !await AppointmentService.isPetOwnedByUser(payload.pet_id, user.user_id)
    ) {
        throw new HttpError(403, 'Forbidden');
    }

    const appointment = await AppointmentService.createAppointment(payload);
    return sendSuccess(res, 201, 'Appointment created', [appointment]);
});

const updateAppointment = asyncHandler(async (req: Request<{ id: string }, unknown, UpdateAppointmentRequest>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const user = (req as any).user;
    if (
        user.role !== 'admin' &&
        !await AppointmentService.isAppointmentOwnedByUser(id, user.user_id)
    ) {
        throw new HttpError(403, 'Forbidden');
    }

    const payload: UpdateAppointmentRequest = {};
    const petId = parseOptionalId(req.body.pet_id, 'pet_id');
    if (petId !== undefined) payload.pet_id = petId;
    const serviceId = parseOptionalId(req.body.service_id, 'service_id');
    if (serviceId !== undefined) payload.service_id = serviceId;
    const staffId = parseOptionalId(req.body.staff_id, 'staff_id');
    if (staffId !== undefined) payload.staff_id = staffId;
    const appointmentDate = parseOptionalDate(req.body.appointment_date, 'appointment_date');
    if (appointmentDate !== undefined) payload.appointment_date = appointmentDate;
    const startTime = parseOptionalDate(req.body.start_time, 'start_time');
    if (startTime !== undefined) payload.start_time = startTime;
    const endTime = parseOptionalDate(req.body.end_time, 'end_time');
    if (endTime !== undefined) payload.end_time = endTime;
    const status = parseOptionalString(req.body.status, 'status');
    if (status !== undefined) payload.status = AppointmentService.resolveAppointmentStatus(status);
    const cancellationReason = parseOptionalString(req.body.cancellation_reason, 'cancellation_reason');
    if (cancellationReason !== undefined) payload.cancellation_reason = cancellationReason;
    const note = parseOptionalString(req.body.note, 'note');
    if (note !== undefined) payload.note = note;
    const servicePrice = parseOptionalNumber(req.body.service_price, 'service_price');
    if (servicePrice !== undefined) payload.service_price = servicePrice;

    if (Object.values(payload).every((value) => value === undefined)) {
        throw new HttpError(400, 'No updatable fields provided');
    }

    if (
        user.role !== 'admin' &&
        payload.pet_id !== undefined &&
        !await AppointmentService.isPetOwnedByUser(payload.pet_id, user.user_id)
    ) {
        throw new HttpError(403, 'Forbidden');
    }

    const appointment = await AppointmentService.updateAppointment(id, payload);
    if (!appointment) {
        throw new HttpError(404, 'Appointment not found');
    }
    return sendSuccess(res, 200, 'Appointment updated', [appointment]);
});

const deleteAppointment = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseId(req.params.id, 'id');
    const appointment = await AppointmentService.getAppointmentById(id);
    if (!appointment) {
        throw new HttpError(404, 'Appointment not found');
    }
    if (appointment.status !== AppointmentService.resolveAppointmentStatus('cancelled')) {
        throw new HttpError(400, 'Chỉ có thể xóa lịch hẹn đã được hủy trước đó.');
    }

    const deleted = await AppointmentService.deleteAppointment(id);
    if (!deleted) {
        throw new HttpError(404, 'Appointment not found');
    }
    return sendSuccess(res, 200, 'Appointment deleted', []);
});

const searchAppointments = asyncHandler(
    async (req: Request<{}, unknown, unknown, AppointmentSearchQuery>, res: Response) => {
        const query: AppointmentSearchQuery = {};
        const statusQuery = parseOptionalString(req.query.status, 'status');
        if (statusQuery !== undefined) query.status = statusQuery;
        const startDateQuery = parseOptionalString(req.query.startDate, 'startDate');
        if (startDateQuery !== undefined) query.startDate = startDateQuery;
        const endDateQuery = parseOptionalString(req.query.endDate, 'endDate');
        if (endDateQuery !== undefined) query.endDate = endDateQuery;
        const petIdQuery = parseOptionalString(req.query.petId, 'petId');
        if (petIdQuery !== undefined) query.petId = petIdQuery;
        const staffIdQuery = parseOptionalString(req.query.staffId, 'staffId');
        if (staffIdQuery !== undefined) query.staffId = staffIdQuery;

        const filters: AppointmentSearchFilters = {};
        if (query.status) filters.status = AppointmentService.resolveAppointmentStatus(parseString(query.status, 'status'));
        if (query.startDate) filters.startDate = parseDate(query.startDate, 'startDate');
        if (query.endDate) filters.endDate = parseDate(query.endDate, 'endDate');
        if (query.petId) filters.petId = parseId(query.petId, 'petId');
        if (query.staffId) filters.staffId = parseId(query.staffId, 'staffId');

        const user = (req as any).user;
        const appointments = user.role === 'admin'
            ? await AppointmentService.searchAppointments(filters)
            : await AppointmentService.searchAppointmentsByOwnerId(user.user_id, filters);
        return sendSuccess(res, 200, 'Appointments retrieved', appointments);
    }
);

export {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    searchAppointments
};
