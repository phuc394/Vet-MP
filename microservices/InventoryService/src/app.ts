import dotenv from "dotenv";
import express from "express";
import SupplierRoute from "./routes/SupplierRoute";
import MedicineInventoryRoute from "./routes/MedicineInventoryRoute";
import InventoryTransactionRoute from "./routes/InventoryTransactionRoute";

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

app.use("/suppliers", SupplierRoute);
app.use("/medicine-inventory", MedicineInventoryRoute);
app.use("/inventory-transactions", InventoryTransactionRoute);

export default app;
