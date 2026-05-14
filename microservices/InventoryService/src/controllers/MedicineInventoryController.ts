import * as MedicineInventoryService from '../services/MedicineInventoryService';

async function getAllMedicineInventory(_req: any, res: any) {
    try {
        const inventory = await MedicineInventoryService.getAllMedicineInventory();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getMedicineInventoryById(req: any, res: any) {
    try {
        const { id } = req.params;
        const inventory = await MedicineInventoryService.getMedicineInventoryById(id);
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getMedicineInventoryByMedicineId(req: any, res: any) {
    try {
        const { medicineId } = req.params;
        const inventory = await MedicineInventoryService.getMedicineInventoryByMedicineId(medicineId);
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createMedicineInventory(req: any, res: any) {
    try {
        const { medicine_id, import_price, available_stock, min_threshold } = req.body;
        const result = await MedicineInventoryService.createMedicineInventory({ medicine_id, import_price, available_stock, min_threshold });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateMedicineInventory(req: any, res: any) {
    try {
        const { id } = req.params;
        const { import_price, available_stock, min_threshold } = req.body;
        const result = await MedicineInventoryService.updateMedicineInventory(id, { import_price, available_stock, min_threshold });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateMedicineInventoryByMedicineId(req: any, res: any) {
    try {
        const { medicineId } = req.params;
        const { import_price, available_stock, min_threshold } = req.body;
        const result = await MedicineInventoryService.updateMedicineInventoryByMedicineId(medicineId, { import_price, available_stock, min_threshold });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteMedicineInventory(req: any, res: any) {
    try {
        const { id } = req.params;
        const result = await MedicineInventoryService.deleteMedicineInventory(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getLowStockItems(_req: any, res: any) {
    try {
        const lowStockItems = await MedicineInventoryService.getLowStockItems();
        res.json(lowStockItems);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function searchMedicineInventory(req: any, res: any) {
    try {
        const { query, lowStock } = req.query;
        const inventory = await MedicineInventoryService.searchMedicineInventory(query, lowStock === 'true');
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllMedicineInventory,
    getMedicineInventoryById,
    getMedicineInventoryByMedicineId,
    createMedicineInventory,
    updateMedicineInventory,
    updateMedicineInventoryByMedicineId,
    deleteMedicineInventory,
    getLowStockItems,
    searchMedicineInventory
};
