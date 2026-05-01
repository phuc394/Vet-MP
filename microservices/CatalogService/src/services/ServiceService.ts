const connection = require('../config/database');
import { Service, CreateServiceRequest, UpdateServiceRequest } from '../models/CatalogModel';

async function getAllServices(): Promise<Service[]> {
    const results = await connection.query('SELECT * FROM Service');
    return results;
}

async function getServiceById(id: number): Promise<Service | null> {
    const results = await connection.query('SELECT * FROM Service WHERE service_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
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
    const result = await connection.query('INSERT INTO Service SET ?', service);
    return { ...service, service_id: result.insertId };
}

async function updateService(id: number, serviceData: UpdateServiceRequest): Promise<Service | null> {
    const result = await connection.query('UPDATE Service SET ? WHERE service_id = ?', [serviceData, id]);
    if (result.affectedRows === 0) {
        return null;
    }
    return getServiceById(id);
}

async function deleteService(id: number): Promise<boolean> {
    const result = await connection.query('DELETE FROM Service WHERE service_id = ?', [id]);
    return result.affectedRows > 0;
}

export {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};

