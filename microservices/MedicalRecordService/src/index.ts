import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3006);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "MedicalRecordService",
    status: "ok",
    port,
  });
});

app.listen(port, () => {
  console.log(`MedicalRecordService listening on port ${port}`);
});
