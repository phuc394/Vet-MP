import connection from '../config/database';
import { Service, CreateServiceRequest, UpdateServiceRequest } from '../models/ServiceModel';

async function getAllServices(): Promise<Service[]> {
    const [rows] = await connection.query('SELECT * FROM Service');
    return rows as Service[];
}

async function getServiceById(id: number): Promise<Service | null> {
    const [rows] = await connection.query('SELECT * FROM Service WHERE service_id = ?', [id]);
    const services = rows as Service[];
    return services.length > 0 ? services[0] ?? null : null;
}

async function createService(serviceData: CreateServiceRequest): Promise<Service> {
    const service: Omit<Service, 'service_id'> = {
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        is_active: serviceData.is_active,
        created_at: new Date(),
        updated_at: new Date()
    };
    const [result] = await connection.query('INSERT INTO Service SET ?', service);
    const insertId = (result as any).insertId;
    return { ...service, service_id: insertId };
}

async function updateService(id: number, serviceData: UpdateServiceRequest): Promise<Service | null> {
    const [result] = await connection.query('UPDATE Service SET ? WHERE service_id = ?', [serviceData, id]);
    if (result.affectedRows === 0) {
        return null;
    }
    return getServiceById(id);
}

async function deleteService(id: number): Promise<boolean> {
    const [result] = await connection.query('DELETE FROM Service WHERE service_id = ?', [id]);
    return result.affectedRows > 0;
}

async function searchServices(query?: string): Promise<Service[]> {
    let sql = 'SELECT * FROM Service WHERE is_active = true';
    const params: any[] = [];
    
    if (query) {
        sql += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${query}%`, `%${query}%`);
    }
    
    const [rows] = await connection.query(sql, params);
    return rows as Service[];
}

export {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    searchServices
};

