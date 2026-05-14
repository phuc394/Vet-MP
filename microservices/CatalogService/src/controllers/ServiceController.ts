import * as ServiceService from '../services/ServiceService';

async function getAllServices(_req: any, res: any) {
    try {
        const services = await ServiceService.getAllServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getServiceById(req: any, res: any) {
    try {
        const { id } = req.params;
        const service = await ServiceService.getServiceById(id);
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createService(req: any, res: any) {
    try {
        const service = await ServiceService.createService(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateService(req: any, res: any) {
    try {
        const { id } = req.params;
        const service = await ServiceService.updateService(id, req.body);
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteService(req: any, res: any) {
    try {
        const { id } = req.params;
        const service = await ServiceService.deleteService(id);
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function searchServices(req: any, res: any) {
    try {
        const { query } = req.query;
        const services = await ServiceService.searchServices(query);
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    searchServices
};
