import * as ReExaminationService from '../services/ReExaminationService';

async function getAllReExaminations(_req: any, res: any) {
    try {
        const reExaminations = await ReExaminationService.getAllReExaminations();
        res.json(reExaminations);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getReExaminationById(req: any, res: any) {
    try {
        const { id } = req.params;
        const reExamination = await ReExaminationService.getReExaminationById(Number(id));
        if (!reExamination) {
            return res.status(404).json({ error: 'Re-examination not found' });
        }
        res.json(reExamination);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getReExaminationsByRecordId(req: any, res: any) {
    try {
        const { recordId } = req.params;
        const reExaminations = await ReExaminationService.getReExaminationsByRecordId(Number(recordId));
        res.json(reExaminations);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createReExamination(req: any, res: any) {
    try {
        const reExamination = await ReExaminationService.createReExamination(req.body);
        res.status(201).json(reExamination);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateReExamination(req: any, res: any) {
    try {
        const { id } = req.params;
        const reExamination = await ReExaminationService.updateReExamination(Number(id), req.body);
        res.json(reExamination);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteReExamination(req: any, res: any) {
    try {
        const { id } = req.params;
        await ReExaminationService.deleteReExamination(Number(id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllReExaminations,
    getReExaminationById,
    getReExaminationsByRecordId,
    createReExamination,
    updateReExamination,
    deleteReExamination
};
