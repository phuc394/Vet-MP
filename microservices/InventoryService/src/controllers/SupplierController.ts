const SupplierService = require('../services/SupplierService');

async function getAllSuppliers(_req: any, res: any) {
    try {
        const suppliers = await SupplierService.getAllSuppliers();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getSupplierById(req: any, res: any) {
    try {
        const { id } = req.params;
        const supplier = await SupplierService.getSupplierById(id);
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createSupplier(req: any, res: any) {
    try {
        const { name, contact_info, address } = req.body;
        const result = await SupplierService.createSupplier({ name, contact_info, address });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateSupplier(req: any, res: any) {
    try {
        const { id } = req.params;
        const { name, contact_info, address } = req.body;
        const result = await SupplierService.updateSupplier(id, { name, contact_info, address });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteSupplier(req: any, res: any) {
    try {
        const { id } = req.params;
        const result = await SupplierService.deleteSupplier(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
