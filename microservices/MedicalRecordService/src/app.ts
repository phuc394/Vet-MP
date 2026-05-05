import dotenv from "dotenv";
import express from "express";
import MedicalRecordRoute from "./routes/MedicalRecordRoute";

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

app.use("/medical-records", MedicalRecordRoute);

export default app;
