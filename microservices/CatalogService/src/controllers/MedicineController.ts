import * as MedicineService from '../services/MedicineService';

async function getAllMedicines(_req: any, res: any) {
    try {
        const medicines = await MedicineService.getAllMedicines();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getMedicineById(req: any, res: any) {
    try {
        const { id } = req.params;
        const medicine = await MedicineService.getMedicineById(Number(id));
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createMedicine(req: any, res: any) {
    try {
        const medicine = await MedicineService.createMedicine(req.body);
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateMedicine(req: any, res: any) {
    try {
        const { id } = req.params;
        const medicine = await MedicineService.updateMedicine(Number(id), req.body);
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteMedicine(req: any, res: any) {
    try {
        const { id } = req.params;
        const medicine = await MedicineService.deleteMedicine(Number(id));
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function searchMedicines(req: any, res: any) {
    try {
        const { query, ingredients } = req.query;
        const medicines = await MedicineService.searchMedicines(query, ingredients);
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines
};
