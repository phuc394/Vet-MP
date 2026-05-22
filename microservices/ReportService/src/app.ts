import dotenv from "dotenv";
import express from "express";
import reportRouter from "./routes/report.route";
import { errorHandler } from "./middleware/error-handler.middleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({
    service: "ReportService",
    status: "ok",
    port: Number(process.env.PORT ?? 3007),
  });
});

app.use("/reports", reportRouter);
app.use(errorHandler);

export default app;
