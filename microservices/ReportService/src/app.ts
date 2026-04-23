import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "ReportService",
    status: "ok",
    port: Number(process.env.PORT ?? 3007),
  });
});

export default app;
