import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import {
  GatewayAuthRequest,
  gatewayAuthMiddleware,
} from "./middleware/gateway-auth.middleware";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:19006",
  "http://localhost:8081",
];

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? defaultAllowedOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Id", "X-User-Role"],
};

app.use(cors(corsOptions));
app.use(gatewayAuthMiddleware);

function registerProxy(route: string, target: string) {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      on: {
        proxyReq(proxyReq, req) {
          const user = (req as GatewayAuthRequest).user;
          if (!user) {
            return;
          }

          proxyReq.setHeader("X-User-Id", String(user.user_id));
          proxyReq.setHeader("X-User-Role", user.role);
        },
      },
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
