import dotenv from 'dotenv';
import express from 'express';
import medicineRoute from './routes/medicine.route';
import serviceRoute from './routes/service.route';
import { errorHandler } from './middleware/error-handler.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/catalog/medicines', medicineRoute);
app.use('/catalog/services', serviceRoute);

app.get("/health", (_request, response) => {
  response.json({
    service: "CatalogService",
    status: "ok",
    port: Number(process.env.PORT ?? 3003),
  });
});

app.use(errorHandler);

export default app;
