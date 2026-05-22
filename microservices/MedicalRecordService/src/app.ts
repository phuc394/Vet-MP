import dotenv from 'dotenv';
import express from 'express';
import medicalRecordRoute from './routes/medical-record.route';
import prescriptionRoute from './routes/prescription.route';
import reExaminationRoute from './routes/re-examination.route';
import { errorHandler } from './middleware/error-handler.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "MedicalRecordService",
    status: "ok",
    port: Number(process.env.PORT ?? 3006),
  });
});


app.use('/medical-records', medicalRecordRoute);
app.use('/prescriptions', prescriptionRoute);
app.use('/re-examinations', reExaminationRoute);
app.use(errorHandler);

export default app;
