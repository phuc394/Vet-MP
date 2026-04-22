import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3004);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({
    service: "InventoryService",
    status: "ok",
    port,
  });
});

app.listen(port, () => {
  console.log(`InventoryService listening on port ${port}`);
});
