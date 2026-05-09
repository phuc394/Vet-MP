import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import staffRoutes from "./routes/staff.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "AuthService",
    status: "ok",
    port: Number(process.env.PORT ?? 3001),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/staff", staffRoutes);

export default app;