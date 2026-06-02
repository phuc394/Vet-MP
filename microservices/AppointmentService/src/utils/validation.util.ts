import { HttpError } from './error.util';

export const parseString = (value: unknown, field: string): string => {
    if (typeof value !== 'string') {
        throw new HttpError(400, `${field} must be a string`);
    }
    const trimmed = value.trim();
    if (!trimmed) {
        throw new HttpError(400, `${field} is required`);
    }
    return trimmed;
};

export const parseOptionalString = (value: unknown, field: string): string | undefined => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new HttpError(400, `${field} must be a string`);
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
};

export const parseNumber = (value: unknown, field: string): number => {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) {
        throw new HttpError(400, `${field} must be a number`);
    }
    return num;
};

export const parseOptionalNumber = (value: unknown, field: string): number | undefined => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return parseNumber(value, field);
};

export const parseId = (value: unknown, field: string): number => {
    const num = parseNumber(value, field);
    if (!Number.isInteger(num) || num <= 0) {
        throw new HttpError(400, `${field} must be a positive integer`);
    }
    return num;
};

export const parseOptionalId = (value: unknown, field: string): number | undefined => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return parseId(value, field);
};

export const parseDate = (value: unknown, field: string): Date => {
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            throw new HttpError(400, `${field} must be a valid date`);
        }
        return value;
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
        throw new HttpError(400, `${field} must be a valid date`);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new HttpError(400, `${field} must be a valid date`);
    }
    return date;
};

export const parseOptionalDate = (value: unknown, field: string): Date | undefined => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return parseDate(value, field);
};

export const parseTime = (value: unknown, field: string): string => {
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            throw new HttpError(400, `${field} must be a valid time`);
        }
        return value.toTimeString().slice(0, 8);
    }

    if (typeof value !== 'string') {
        throw new HttpError(400, `${field} must be a valid time`);
    }

    const trimmed = value.trim();
    const timeOnlyMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (timeOnlyMatch) {
        const hours = Number(timeOnlyMatch[1]);
        const minutes = Number(timeOnlyMatch[2]);
        const seconds = timeOnlyMatch[3] === undefined ? 0 : Number(timeOnlyMatch[3]);

        if (hours <= 23 && minutes <= 59 && seconds <= 59) {
            return [
                String(hours).padStart(2, '0'),
                String(minutes).padStart(2, '0'),
                String(seconds).padStart(2, '0')
            ].join(':');
        }
    }

    const dateTimeMatch = trimmed.match(/[T\s](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (dateTimeMatch) {
        return parseTime(
            [
                dateTimeMatch[1],
                dateTimeMatch[2],
                dateTimeMatch[3] ?? '00'
            ].join(':'),
            field
        );
    }

    const date = new Date(trimmed);
    if (!Number.isNaN(date.getTime())) {
        return date.toTimeString().slice(0, 8);
    }

    throw new HttpError(400, `${field} must be a valid time`);
};

export const parseOptionalTime = (value: unknown, field: string): string | undefined => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return parseTime(value, field);
};

export const parseBoolean = (value: unknown, field: string): boolean => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    throw new HttpError(400, `${field} must be a boolean`);
};

export const parseOptionalBoolean = (value: unknown, field: string): boolean | undefined => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return parseBoolean(value, field);
};
