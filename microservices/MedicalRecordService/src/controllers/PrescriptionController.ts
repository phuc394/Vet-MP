import * as PrescriptionService from '../services/PrescriptionService';

async function getAllPrescriptions(_req: any, res: any) {
    try {
        const prescriptions = await PrescriptionService.getAllPrescriptions();
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPrescriptionById(req: any, res: any) {
    try {
        const { id } = req.params;
        const prescription = await PrescriptionService.getPrescriptionById(Number(id));
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPrescriptionsByRecordId(req: any, res: any) {
    try {
        const { recordId } = req.params;
        const prescriptions = await PrescriptionService.getPrescriptionsByRecordId(Number(recordId));
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createPrescription(req: any, res: any) {
    try {
        const prescription = await PrescriptionService.createPrescription(req.body);
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updatePrescription(req: any, res: any) {
    try {
        const { id } = req.params;
        const prescription = await PrescriptionService.updatePrescription(Number(id), req.body);
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deletePrescription(req: any, res: any) {
    try {
        const { id } = req.params;
        await PrescriptionService.deletePrescription(Number(id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllPrescriptions,
    getPrescriptionById,
    getPrescriptionsByRecordId,
    createPrescription,
    updatePrescription,
    deletePrescription
};
