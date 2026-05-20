import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = Number(process.env.PORT) || 3000;

function registerProxy(route: string, target: string) {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
    }),
  );
}

registerProxy("/api/v1/auth", "http://localhost:3001/api/v1/auth");
registerProxy("/api/v1/profile", "http://localhost:3001/api/v1/profile");
registerProxy("/api/v1/staff", "http://localhost:3001/api/v1/staff");
registerProxy("/api/v1/pets", "http://localhost:3002/api/v1/pets");
registerProxy("/api/v1/catalog", "http://localhost:3003/catalog");
registerProxy("/api/v1/suppliers", "http://localhost:3004/suppliers");
registerProxy("/api/v1/medicine-inventory", "http://localhost:3004/medicine-inventory");
registerProxy("/api/v1/inventory-transactions", "http://localhost:3004/inventory-transactions");
registerProxy("/api/v1/appointments", "http://localhost:3005/appointments");
registerProxy("/api/v1/medical-records", "http://localhost:3006/medical-records");
registerProxy("/api/v1/prescriptions", "http://localhost:3006/prescriptions");
registerProxy("/api/v1/re-examinations", "http://localhost:3006/re-examinations");
registerProxy("/api/v1/reports", "http://localhost:3007/reports");

app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
