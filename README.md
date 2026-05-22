# Tổng quan Đồ án Vet-MP

Vet-MP là một phần mềm quản lý hệ thống thú y. Bác sĩ có thể quản lý hồ sơ bệnh án. Quản trị viên có thể quản lý kho vật liệu, thuốc và xem báo cáo doanh thu

## Công nghệ sử dụng

- Frontend: React Native
- Backend: ExpressJS
- Database: Supabase

## Backend API Refactor (Appointment, Catalog, Inventory, MedicalRecord)

### Architectural Changes
The four core domains now follow a strict **Route → Controller → Service → Model** flow with centralized response formatting and global error handling per microservice. All database connectivity is configured exclusively through environment variables.

### Integration Steps
1. Copy each service's `.env.example` to `.env` and set database credentials (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONNECTION_LIMIT`) plus `PORT`.
2. Install dependencies in each service folder: `npm install`.
3. Run `npm run build` and `npm run start` (or `npm run dev`) per service.

### Standard Response Schema
Success:
```json
{ "status": 200, "message": "OK", "data": [] }
```
Error:
```json
{ "status": 400, "message": "Error message" }
```

### Standard Endpoints (All Resources)
Each resource exposes only the following operations:

| Method | Path | Notes |
| --- | --- | --- |
| GET | / | Supports `?sortBy=field&order=asc|desc` |
| GET | /search | Max 10 results per request |
| GET | /:id | Retrieve by identifier |
| POST | / | Create a record |
| PUT | /:id | Update a record |
| DELETE | /:id | Delete a record |

### Resource Routes
| Service | Resource Base Path |
| --- | --- |
| AppointmentService | `/appointments` |
| CatalogService | `/catalog/medicines`, `/catalog/services` |
| InventoryService | `/suppliers`, `/medicine-inventory`, `/inventory-transactions` |
| MedicalRecordService | `/medical-records`, `/prescriptions`, `/re-examinations` |
