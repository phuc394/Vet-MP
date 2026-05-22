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
