import connection from '../config/database.config';
import {
    CreateServiceRequest,
    Service,
    ServiceSearchFilters,
    ServiceSortQuery,
    SortOrder,
    UpdateServiceRequest
} from '../models/service.model';
import { HttpError } from '../utils/error.util';

type SortMode = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest';

const SORT_FIELDS = [
    'service_id',
    'name',
    'description',
    'price',
    'is_active',
    'created_at',
    'updated_at'
];

const DATE_FIELDS = ['created_at', 'updated_at'];
const DEFAULT_SORT_BY = 'created_at';

type ServiceRow = Omit<Service, 'is_active'> & {
    is_active: boolean | number | string | Buffer;
};

function normalizeService(row: ServiceRow): Service {
    const rawIsActive = row.is_active;
    const isActive = Buffer.isBuffer(rawIsActive)
        ? rawIsActive[0] === 1
        : rawIsActive === true || rawIsActive === 1 || rawIsActive === '1';

    return {
        ...row,
        is_active: isActive
    };
}

function normalizeServices(rows: unknown): Service[] {
    return (rows as ServiceRow[]).map(normalizeService);
}

function resolveSort(query?: ServiceSortQuery): { sortBy: string; order: SortOrder; mode: SortMode } {
    const sortByRaw = typeof query?.sortBy === 'string' ? query.sortBy.trim() : '';
    const sortBy = sortByRaw.length > 0 ? sortByRaw : DEFAULT_SORT_BY;

    if (!SORT_FIELDS.includes(sortBy)) {
        throw new HttpError(400, `sortBy must be one of: ${SORT_FIELDS.join(', ')}`);
    }

    const orderRaw = typeof query?.order === 'string' ? query.order.toLowerCase() : '';
    const defaultOrder: SortOrder = DATE_FIELDS.includes(sortBy) ? 'desc' : 'asc';
    const order: SortOrder = orderRaw === 'asc' || orderRaw === 'desc' ? orderRaw : defaultOrder;

    const mode: SortMode = DATE_FIELDS.includes(sortBy)
        ? order === 'desc'
            ? 'Newest'
            : 'Oldest'
        : order === 'asc'
            ? 'A-Z'
            : 'Z-A';

    if (!['A-Z', 'Z-A', 'Newest', 'Oldest'].includes(mode)) {
        throw new HttpError(400, 'Invalid sort mode');
    }

    return { sortBy, order, mode };
}

async function getAllServices(sortQuery?: ServiceSortQuery): Promise<Service[]> {
    const { sortBy, order } = resolveSort(sortQuery);
    const [rows] = await connection.query(`SELECT * FROM Service ORDER BY ${sortBy} ${order}`);
    return normalizeServices(rows);
}

async function getServiceById(id: number): Promise<Service | null> {
    const [rows] = await connection.query('SELECT * FROM Service WHERE service_id = ?', [id]);
    const services = normalizeServices(rows);
    return services.length > 0 ? services[0] ?? null : null;
}

async function createService(serviceData: CreateServiceRequest): Promise<Service> {
    const service: Omit<Service, 'service_id'> = {
        name: serviceData.name,
        price: serviceData.price,
        is_active: serviceData.is_active,
        created_at: new Date(),
        updated_at: new Date()
    };

    if (serviceData.description !== undefined) {
        service.description = serviceData.description;
    }

    const [result] = await connection.query('INSERT INTO Service SET ?', [service]);
    const insertId = (result as { insertId: number }).insertId;
    return { ...service, service_id: insertId };
}

async function updateService(id: number, serviceData: UpdateServiceRequest): Promise<Service | null> {
    const updateData = Object.fromEntries(Object.entries(serviceData).filter(([, value]) => value !== undefined));
    const payload = {
        ...updateData,
        updated_at: new Date()
    };

    const [result] = await connection.query('UPDATE Service SET ? WHERE service_id = ?', [payload, id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        return null;
    }

    return getServiceById(id);
}

async function deleteService(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Service WHERE service_id = ?', [id]);
    return (result as { affectedRows: number }).affectedRows > 0;
}

async function searchServices(filters: ServiceSearchFilters): Promise<Service[]> {
    let sql = 'SELECT * FROM Service WHERE 1=1';
    const params: Array<string | number | boolean> = [];

    if (filters.name) {
        sql += ' AND name LIKE ?';
        params.push(`%${filters.name}%`);
    }

    if (filters.description) {
        sql += ' AND description LIKE ?';
        params.push(`%${filters.description}%`);
    }

    if (filters.isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(filters.isActive);
    }

    sql += ' LIMIT 10';
    const [rows] = await connection.query(sql, params);
    return normalizeServices(rows);
}

export {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    searchServices
};
