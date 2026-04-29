import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use('/api/v1/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/auth': '/auth',
    },
}));

app.use('/api/v1/users', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/users': '/users',
    },
}));

app.use('/api/v1/pets', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/pets': '/pets',
    },
}));

app.use('/api/v1/catalog', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/catalog': '/catalog',
    },
}));

app.use('/api/v1/inventory', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/inventory': '/inventory',
    },
}));

app.use('/api/v1/suppliers', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/suppliers': '/suppliers',
    },
}));

app.use('/api/v1/appointments', createProxyMiddleware({
    target: 'http://localhost:3005',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/appointments': '/appointments',
    },
}));

app.use('/api/v1/medical-records', createProxyMiddleware({
    target: 'http://localhost:3006',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/medical-records': '/medical-records',
    },
}));


app.use('/api/v1/reports', createProxyMiddleware({
    target: 'http://localhost:3007',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/reports': '/reports',
    },
}));

app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
