import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import {
  GatewayAuthRequest,
  gatewayAuthMiddleware,
} from "./middleware/gateway-auth.middleware";

dotenv.config();

export const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

function getServiceUrl(envName: string, fallback: string) {
  const value = process.env[envName];

  if (isProduction && !value) {
    throw new Error(`Missing ${envName}. Set the Railway service URL before deploying.`);
  }

  return (value ?? fallback).replace(/\/+$/, "");
}

const serviceUrls = {
  auth: getServiceUrl("AUTH_SERVICE_URL", "http://localhost:3001"),
  pet: getServiceUrl("PET_SERVICE_URL", "http://localhost:3002"),
  catalog: getServiceUrl("CATALOG_SERVICE_URL", "http://localhost:3003"),
  inventory: getServiceUrl("INVENTORY_SERVICE_URL", "http://localhost:3004"),
  appointment: getServiceUrl("APPOINTMENT_SERVICE_URL", "http://localhost:3005"),
  medicalRecord: getServiceUrl("MEDICAL_RECORD_SERVICE_URL", "http://localhost:3006"),
  report: getServiceUrl("REPORT_SERVICE_URL", "http://localhost:3007"),
};

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:19006",
  "http://localhost:8081",
];

if (isProduction && !process.env.CORS_ALLOWED_ORIGINS) {
  throw new Error("Missing CORS_ALLOWED_ORIGINS. Add your frontend/admin domains before deploying.");
}

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

app.get("/health", (_request, response) => {
  response.json({
    service: "ApiGateway",
    status: "ok",
    port,
  });
});

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

registerProxy("/api/v1/auth", `${serviceUrls.auth}/api/v1/auth`);
registerProxy("/api/v1/profile", `${serviceUrls.auth}/api/v1/profile`);
registerProxy("/api/v1/staff", `${serviceUrls.auth}/api/v1/staff`);
registerProxy("/api/v1/users", `${serviceUrls.auth}/api/v1/users`);
registerProxy("/api/v1/pets", `${serviceUrls.pet}/api/v1/pets`);
registerProxy("/api/v1/catalog", `${serviceUrls.catalog}/catalog`);
registerProxy("/api/v1/suppliers", `${serviceUrls.inventory}/suppliers`);
registerProxy("/api/v1/medicine-inventory", `${serviceUrls.inventory}/medicine-inventory`);
registerProxy("/api/v1/inventory-transactions", `${serviceUrls.inventory}/inventory-transactions`);
registerProxy("/api/v1/appointments", `${serviceUrls.appointment}/appointments`);
registerProxy("/api/v1/medical-records", `${serviceUrls.medicalRecord}/medical-records`);
registerProxy("/api/v1/prescriptions", `${serviceUrls.medicalRecord}/prescriptions`);
registerProxy("/api/v1/re-examinations", `${serviceUrls.medicalRecord}/re-examinations`);
registerProxy("/api/v1/reports", `${serviceUrls.report}/reports`);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
  });
}
