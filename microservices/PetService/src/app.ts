import dotenv from "dotenv";
import express from "express";
import petRoutes from "./routes/pet.routes";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "PetService",
    status: "ok",
    port: Number(process.env.PORT ?? 3002),
  });
});

app.use("/api/v1/pets", petRoutes);

export default app;
