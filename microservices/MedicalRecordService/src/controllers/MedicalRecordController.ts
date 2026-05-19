import * as MedicalRecordService from '../services/MedicalRecordService';

async function getAllMedicalRecords(_req: any, res: any) {
    try {
        const medicalRecords = await MedicalRecordService.getAllMedicalRecords();
        res.json(medicalRecords);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getMedicalRecordById(req: any, res: any) {
    try {
        const { id } = req.params;
        const medicalRecord = await MedicalRecordService.getMedicalRecordById(Number(id));
        res.json(medicalRecord);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createMedicalRecord(req: any, res: any) {
    try {
        const medicalRecord = await MedicalRecordService.createMedicalRecord(req.body);
        res.json(medicalRecord);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateMedicalRecord(req: any, res: any) {
    try {
        const { id } = req.params;
        const medicalRecord = await MedicalRecordService.updateMedicalRecord(Number(id), req.body);
        res.json(medicalRecord);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteMedicalRecord(req: any, res: any) {
    try {
        const { id } = req.params;
        await MedicalRecordService.deleteMedicalRecord(Number(id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function searchMedicalRecords(req: any, res: any) {
    try {
        const { symptoms, diagnosis, status } = req.query;
        const records = await MedicalRecordService.searchMedicalRecords(symptoms, diagnosis, status);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllMedicalRecords,
    getMedicalRecordById,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    searchMedicalRecords
};
