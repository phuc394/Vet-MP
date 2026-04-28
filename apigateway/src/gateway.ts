import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use('/api/v1/medical-records', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
}));

app.use('/api/v1/inventory', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
}));

app.use('/api/v1/suppliers', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
}));

app.use('/api/v1/appointments', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
}));

app.use('/api/v1/auth', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
}));

app.use('/api/v1/users', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
}));

app.use('/api/v1/pets', createProxyMiddleware({
    target: 'http://localhost:3005',
    changeOrigin: true,
}));

app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
