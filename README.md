# Vet-MP

## Giới thiệu project

Vet-MP là hệ thống quản lý phòng khám thú y, hỗ trợ các nghiệp vụ như quản lý tài khoản, thú cưng, lịch hẹn, hồ sơ bệnh án, đơn thuốc, danh mục dịch vụ, kho thuốc/vật tư và báo cáo doanh thu.

Project được tổ chức theo kiến trúc microservices. Backend gồm nhiều service độc lập và một API Gateway để gom các API về cùng một đầu vào. Frontend gồm ứng dụng khách hàng trên React Native/Expo và trang quản trị dành cho nhân viên/quản trị viên.

## Công nghệ sử dụng

- Frontend mobile: React Native, Expo, TypeScript, React Navigation, Redux Toolkit, Axios, React Native Paper.
- Admin dashboard: React, Vite, TypeScript, Refine, Material UI, Redux Toolkit, Axios, Recharts.
- Backend: Node.js, ExpressJS, TypeScript, API Gateway, OpenAPI Validator, JWT.
- Cơ sở dữ liệu: MySQL 8.4.
- Hạ tầng phát triển: Docker, Docker Compose, npm.

## Cài đặt backend

### Yêu cầu

- Node.js 20 trở lên.
- npm.
- Docker và Docker Compose.

### Chạy hệ thống bằng Docker Compose

Ở thư mục gốc của project, chạy:

```bash
docker compose up --build
```

Docker Compose sẽ khởi động MySQL, seed dữ liệu mẫu, các microservice, API Gateway và Admin dashboard.

Các service mặc định:

- API Gateway: `http://localhost:3000`
- Admin dashboard: `http://localhost:8080`
- Auth Service: `http://localhost:3001`
- Pet Service: `http://localhost:3002`
- Catalog Service: `http://localhost:3003`
- Inventory Service: `http://localhost:3004`
- Appointment Service: `http://localhost:3005`
- Medical Record Service: `http://localhost:3006`
- Report Service: `http://localhost:3007`
- MySQL: `localhost:3308`

API của hệ thống đi qua gateway với prefix:

```text
http://localhost:3000/api/v1
```

Admin dashboard trong Docker được build với API Gateway mặc định:

```text
http://localhost:3000
```

Nếu cần đổi URL API cho dashboard, đặt biến môi trường `ADMIN_DASHBOARD_API_BASE_URL` trước khi build lại.

PowerShell:

```powershell
$env:ADMIN_DASHBOARD_API_BASE_URL="https://your-gateway.example.com"
docker compose up --build
```

Bash:

```bash
ADMIN_DASHBOARD_API_BASE_URL=https://your-gateway.example.com docker compose up --build
```

Để dừng hệ thống:

```bash
docker compose down
```

Nếu muốn xóa luôn dữ liệu MySQL trong volume:

```bash
docker compose down -v
```

### Chạy backend thủ công

Nếu không dùng Docker Compose, cần tự chuẩn bị MySQL và tạo file `.env` cho API Gateway cùng từng service từ các file `.env.example`.

Ví dụ với API Gateway:

```bash
cd apigateway
npm install
copy .env.example .env
npm run dev
```

Ví dụ với một microservice:

```bash
cd microservices/AuthService
npm install
copy .env.example .env
npm run dev
```

Lặp lại bước tương tự cho các service trong thư mục `microservices`:

- `AuthService`
- `PetService`
- `CatalogService`
- `InventoryService`
- `AppointmentService`
- `MedicalRecordService`
- `ReportService`

## Cài đặt frontend

### Ứng dụng mobile

Frontend mobile nằm trong thư mục `frontend`.

```bash
cd frontend
npm install
copy .env.example .env
npm start
```

Nếu chạy với backend local, cập nhật biến môi trường trong `frontend/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

Một số lệnh thường dùng:

```bash
npm run android
npm run ios
npm run web
```

### Admin dashboard

Trang quản trị nằm trong thư mục `admin-dashboard`.

```bash
cd admin-dashboard
npm install
copy .env.example .env
npm run dev
```

Nếu chạy với backend local, cập nhật biến môi trường trong `admin-dashboard/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Các lệnh thường dùng:

```bash
npm run build
npm run start
npm run test
```

Chạy riêng Admin dashboard bằng Dockerfile:

```bash
cd admin-dashboard
docker build -t vet-mp-admin-dashboard .
docker run --rm -p 8080:80 vet-mp-admin-dashboard
```

Sau khi container chạy, mở:

```text
http://localhost:8080
```

Nếu API Gateway không chạy ở `http://localhost:3000`, truyền URL API khi build image:

```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost:3000 -t vet-mp-admin-dashboard .
```
