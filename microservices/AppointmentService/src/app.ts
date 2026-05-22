import dotenv from 'dotenv';
import express from 'express';
import appointmentRoute from './routes/appointment.route';
import { errorHandler } from './middleware/error-handler.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "AppointmentService",
    status: "ok",
    port: Number(process.env.PORT ?? 3005),
  });
});

app.use('/appointments', appointmentRoute);
app.use(errorHandler);


export default app;
