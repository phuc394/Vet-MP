import dotenv from 'dotenv';
import express from 'express';
import supplierRoute from './routes/supplier.route';
import medicineInventoryRoute from './routes/medicine-inventory.route';
import inventoryTransactionRoute from './routes/inventory-transaction.route';
import { errorHandler } from './middleware/error-handler.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "InventoryService",
    status: "ok",
    port: Number(process.env.PORT ?? 3004),
  });
});

app.use('/suppliers', supplierRoute);
app.use('/medicine-inventory', medicineInventoryRoute);
app.use('/inventory-transactions', inventoryTransactionRoute);
app.use(errorHandler);

export default app;
