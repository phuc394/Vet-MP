import dotenv from "dotenv";
import express from "express";


dotenv.config();

const app = express();
const MedicineRoute = require('./routes/MedicineRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/medicines', MedicineRoute);

app.get("/health", (_request, response) => {
  response.json({
    service: "CatalogService",
    status: "ok",
    port: Number(process.env.PORT ?? 3003),
  });
});

export default app;
