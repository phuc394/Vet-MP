# Vet-MP - Tài liệu báo cáo

## 1. Đặt tả yêu cầu ứng dụng

### 1.1. Giới thiệu đề tài

Vet-MP là hệ thống quản lý phòng khám thú y, được xây dựng nhằm hỗ trợ các nghiệp vụ hằng ngày của phòng khám như quản lý tài khoản, thú cưng, lịch hẹn, dịch vụ, thuốc, kho, hồ sơ bệnh án, đơn thuốc và báo cáo doanh thu. Hệ thống gồm ứng dụng mobile cho khách hàng, trang quản trị cho nhân viên/quản trị viên và cụm backend theo kiến trúc microservices.

Trong thực tế, phòng khám thú y cần xử lý nhiều luồng thông tin khác nhau: thông tin chủ nuôi, hồ sơ thú cưng, lịch khám, dịch vụ, bác sĩ phụ trách, đơn thuốc, tồn kho thuốc và doanh thu. Nếu quản lý thủ công bằng sổ sách hoặc file rời rạc, việc tra cứu lịch sử khám, theo dõi kho và tổng hợp báo cáo sẽ tốn thời gian, dễ sai sót. Vet-MP giải quyết vấn đề này bằng cách tập trung dữ liệu, chuẩn hóa quy trình và phân quyền theo từng vai trò người dùng.

### 1.2. Mục tiêu ứng dụng

- Cung cấp nền tảng quản lý tổng thể cho phòng khám thú y.
- Cho phép khách hàng đăng ký, đăng nhập, quản lý hồ sơ cá nhân, quản lý thú cưng và đặt lịch hẹn.
- Cho phép nhân viên tiếp nhận lịch hẹn, cập nhật trạng thái lịch khám, tạo hồ sơ bệnh án và kê đơn thuốc.
- Cho phép quản trị viên quản lý nhân viên, tài khoản, danh mục dịch vụ, danh mục thuốc, nhà cung cấp, kho thuốc và giao dịch kho.
- Cung cấp dashboard báo cáo doanh thu, thống kê lịch hẹn, thống kê thú cưng, thống kê người dùng và cảnh báo tồn kho thấp.
- Đảm bảo dữ liệu được lưu trữ có cấu trúc, có khả năng mở rộng và dễ bảo trì.

### 1.3. Phạm vi ứng dụng

Hệ thống tập trung vào các chức năng cốt lõi của phòng khám thú y:

- Quản lý tài khoản và xác thực người dùng.
- Quản lý khách hàng, nhân viên và quản trị viên.
- Quản lý thú cưng của khách hàng.
- Quản lý danh mục dịch vụ khám/chăm sóc.
- Quản lý danh mục thuốc.
- Quản lý kho thuốc, nhà cung cấp và giao dịch nhập/xuất/điều chỉnh.
- Quản lý lịch hẹn khám.
- Quản lý hồ sơ bệnh án, đơn thuốc và lịch tái khám.
- Báo cáo, thống kê và trực quan hóa dữ liệu.

### 1.4. Yêu cầu chức năng

#### 1.4.1. Chức năng cho khách hàng

- Đăng ký tài khoản mới.
- Đăng nhập bằng email/số điện thoại và mật khẩu.
- Quên mật khẩu, đặt lại mật khẩu và đổi mật khẩu.
- Xem và cập nhật thông tin cá nhân.
- Thêm, xem và quản lý danh sách thú cưng.
- Xem chi tiết thú cưng.
- Xem danh sách dịch vụ của phòng khám.
- Xem chi tiết dịch vụ.
- Đặt lịch hẹn cho thú cưng theo dịch vụ, ngày và giờ.
- Xác nhận thông tin lịch hẹn trước khi gửi.
- Xem lịch hẹn trên màn hình lịch.
- Xem chi tiết lịch hẹn.

#### 1.4.2. Chức năng cho nhân viên

- Đăng nhập vào trang quản trị.
- Xem các lịch hẹn được phân công.
- Cập nhật trạng thái lịch hẹn.
- Tạo và cập nhật hồ sơ bệnh án cho lịch khám.
- Tạo đơn thuốc trong quá trình lập hồ sơ bệnh án.
- Xem thông tin lịch tái khám liên quan.
- Tìm kiếm, lọc và xem chi tiết dữ liệu trong phạm vi được cấp quyền.

#### 1.4.3. Chức năng cho quản trị viên

- Đăng nhập vào trang quản trị.
- Quản lý tài khoản người dùng.
- Quản lý nhân viên, chức vụ và số giấy phép hành nghề.
- Quản lý danh sách thú cưng và khách hàng.
- Quản lý danh mục dịch vụ.
- Quản lý danh mục thuốc.
- Quản lý tồn kho thuốc.
- Quản lý nhà cung cấp.
- Quản lý giao dịch kho gồm nhập kho, xuất theo đơn thuốc và điều chỉnh tồn kho.
- Tạo lịch hẹn cho khách hàng khi cần.
- Xem dashboard báo cáo và biểu đồ.
- Tìm kiếm, lọc, thêm, sửa, xóa hoặc vô hiệu hóa dữ liệu theo từng loại tài nguyên.

### 1.5. Yêu cầu phi chức năng

- Giao diện dễ sử dụng, tách riêng trải nghiệm mobile cho khách hàng và web dashboard cho nội bộ phòng khám.
- API có cấu trúc rõ ràng, thống nhất qua API Gateway.
- Bảo mật bằng JWT access token, refresh token và phân quyền theo vai trò.
- CSDL MySQL sử dụng kiểu dữ liệu phù hợp, khóa chính, chỉ mục và ràng buộc khóa ngoại tại các bảng cần thiết.
- Hệ thống có thể chạy bằng Docker Compose để dễ cài đặt và triển khai trong môi trường phát triển.
- Code tách lớp controller, service, model, middleware, route và validator để dễ bảo trì.
- Có unit test và integration test cho các thành phần quan trọng.

## 2. Giới thiệu công nghệ sử dụng

### 2.1. Frontend mobile

- Tên công nghệ: React Native, Expo, TypeScript.
- Thư viện chính: React Navigation, Redux Toolkit, React Redux, Axios, React Native Paper, Expo Image Picker, Expo Splash Screen.
- Mục đích sử dụng: xây dựng ứng dụng mobile/web cho khách hàng với các màn hình đăng nhập, đăng ký, trang chủ, dịch vụ, thú cưng, lịch hẹn và hồ sơ cá nhân.
- Ưu điểm:
  - React Native cho phép phát triển ứng dụng đa nền tảng bằng một codebase.
  - Expo hỗ trợ chạy, debug và build ứng dụng nhanh.
  - TypeScript giúp tăng tính an toàn kiểu dữ liệu.
  - Redux Toolkit giúp quản lý state rõ ràng hơn.
- Hạn chế:
  - Cần cấu hình môi trường mobile/emulator khi test trên thiết bị thật.
  - Một số tính năng native có thể cần cấu hình riêng nếu mở rộng sau này.
- Lý do chọn: phù hợp với yêu cầu xây dựng app khách hàng nhanh, dễ bảo trì, dễ kết nối REST API.

### 2.2. Admin dashboard

- Tên công nghệ: React, Vite, TypeScript.
- Thư viện chính: Refine, Material UI, MUI X Data Grid, Redux Toolkit, Axios, React Hook Form, Recharts.
- Mục đích sử dụng: xây dựng trang quản trị cho admin và staff, quản lý dữ liệu dạng bảng, form thêm/sửa, modal chi tiết và dashboard báo cáo.
- Ưu điểm:
  - Vite khởi động và build nhanh.
  - Material UI cung cấp bộ component đầy đủ, phù hợp dashboard quản trị.
  - Refine hỗ trợ mô hình ứng dụng CRUD.
  - Recharts phù hợp để vẽ biểu đồ doanh thu và thống kê.
- Hạn chế:
  - Ứng dụng quản trị phụ thuộc vào API Gateway và quyền truy cập từ backend.
  - Cần kiểm soát tốt state và permission khi số lượng resource tăng.
- Lý do chọn: phù hợp với ứng dụng quản trị cần bảng dữ liệu, form, lọc/tìm kiếm và báo cáo trực quan.

### 2.3. Backend và API Gateway

- Tên công nghệ: Node.js, ExpressJS, TypeScript.
- Thư viện chính: express-openapi-validator, jsonwebtoken, bcrypt, mysql2, cors, dotenv, nodemailer.
- Mục đích sử dụng: xây dựng các microservice độc lập và API Gateway làm đầu vào chung cho frontend.
- Ưu điểm:
  - ExpressJS gọn nhẹ, dễ xây dựng REST API.
  - TypeScript giúp backend rõ ràng về kiểu dữ liệu và dễ bảo trì.
  - express-openapi-validator giúp validate request theo OpenAPI.
  - JWT phù hợp cho xác thực stateless.
  - bcrypt giúp băm mật khẩu an toàn.
- Hạn chế:
  - Microservices làm tăng số lượng service cần cấu hình và giám sát.
  - Cần quản lý đồng bộ dữ liệu giữa các database/service cẩn thận.
- Lý do chọn: phù hợp với hệ thống có nhiều miền nghiệp vụ riêng như auth, pet, catalog, inventory, appointment, medical record và report.

### 2.4. Cơ sở dữ liệu

- Tên công nghệ: MySQL 8.4.
- Mục đích sử dụng: lưu trữ dữ liệu có cấu trúc của phòng khám.
- Các database:
  - `auth_db_vet`: người dùng, nhân viên, refresh token.
  - `pet_db_vet`: thú cưng.
  - `catalog_db_vet`: dịch vụ và thuốc.
  - `inventory_db_vet`: nhà cung cấp, tồn kho, giao dịch kho.
  - `appointment_db_vet`: lịch hẹn.
  - `medical_record_db_vet`: hồ sơ bệnh án, đơn thuốc, tái khám.
- Ưu điểm:
  - Ổn định, phổ biến, dễ cài đặt.
  - Hỗ trợ khóa chính, chỉ mục, ràng buộc và transaction.
  - Phù hợp với dữ liệu quan hệ của phòng khám.
- Hạn chế:
  - Khi tách database theo service, việc join trực tiếp giữa các service không nên làm ở tầng nghiệp vụ.
  - Cần thiết kế API tổng hợp khi cần hiển thị dữ liệu kết hợp.

### 2.5. Công cụ hạ tầng và kiểm thử

- Docker và Docker Compose: đóng gói MySQL, seed data, microservices, gateway và admin dashboard.
- Jest và Supertest: viết unit test và integration test cho backend.
- Vitest và Testing Library: kiểm thử logic Redux, permission và UI của admin dashboard.
- ESLint: kiểm tra chất lượng code frontend.

## 3. Phân tích và thiết kế CSDL ứng dụng

Phần diagram như use case, sequence diagram, class/table diagram và các màn hình phác thảo đã được thực hiện riêng nên tài liệu này không trình bày lại chi tiết diagram.

### 3.1. Tổng quan thiết kế CSDL

Hệ thống sử dụng nhiều database tương ứng với từng microservice. Cách tách này giúp mỗi service quản lý miền dữ liệu riêng, giảm phụ thuộc giữa các module và thuận lợi khi mở rộng.

### 3.2. Danh sách bảng chính

#### Auth database - `auth_db_vet`

Bảng `Users` lưu thông tin tài khoản:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `user_id` | INT | Khóa chính, tự tăng |
| `full_name` | VARCHAR(100) | Họ tên người dùng |
| `phone_number` | VARCHAR(20) | Số điện thoại, duy nhất |
| `email` | VARCHAR(100) | Email, duy nhất |
| `password_hash` | VARCHAR(255) | Mật khẩu đã băm |
| `role` | ENUM | Vai trò: admin, staff, customer |
| `status` | ENUM | Trạng thái: active, inactive |
| `avatar` | MEDIUMTEXT | Ảnh đại diện dạng chuỗi |
| `address` | TEXT | Địa chỉ |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

Bảng `Employee` lưu thông tin nhân viên:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `employee_id` | INT | Khóa chính |
| `user_id` | INT | Liên kết tài khoản trong Users |
| `position` | VARCHAR(50) | Chức vụ |
| `license_number` | VARCHAR(50) | Số giấy phép/chứng chỉ |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

Bảng `RefreshTokens` lưu refresh token:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `token_id` | INT | Khóa chính |
| `user_id` | INT | Người dùng sở hữu token |
| `refresh_token` | TEXT | Refresh token |
| `expires_at` | DATETIME | Thời điểm hết hạn |
| `created_at` | DATETIME | Thời điểm tạo |

#### Pet database - `pet_db_vet`

Bảng `Pet` lưu hồ sơ thú cưng:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `pet_id` | INT | Khóa chính |
| `owner_id` | INT | ID chủ nuôi |
| `name` | VARCHAR(50) | Tên thú cưng |
| `sex` | ENUM | Giới tính: male, female |
| `species` | VARCHAR(50) | Loài thú cưng |
| `breed` | VARCHAR(50) | Giống |
| `birth_date` | DATE | Ngày sinh |
| `weight` | DECIMAL(5,2) | Cân nặng |
| `notes` | TEXT | Ghi chú |
| `avatar` | MEDIUMTEXT | Ảnh thú cưng |
| `is_deleted` | BOOLEAN | Trạng thái xóa mềm |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

#### Catalog database - `catalog_db_vet`

Bảng `Service` lưu danh mục dịch vụ:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `service_id` | INT | Khóa chính |
| `name` | VARCHAR(100) | Tên dịch vụ |
| `description` | TEXT | Mô tả |
| `price` | DECIMAL(10,2) | Giá dịch vụ |
| `is_active` | BOOLEAN | Trạng thái đang sử dụng |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

Bảng `Medicine` lưu danh mục thuốc:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `medicine_id` | INT | Khóa chính |
| `name` | VARCHAR(100) | Tên thuốc |
| `unit` | VARCHAR(20) | Đơn vị tính |
| `selling_price` | DECIMAL(10,2) | Giá bán |
| `ingredients` | TEXT | Thành phần |
| `is_active` | BOOLEAN | Trạng thái đang sử dụng |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

#### Inventory database - `inventory_db_vet`

Bảng `Supplier` lưu nhà cung cấp:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `supplier_id` | INT | Khóa chính |
| `name` | VARCHAR(100) | Tên nhà cung cấp |
| `contact_info` | VARCHAR(255) | Thông tin liên hệ |
| `address` | TEXT | Địa chỉ |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

Bảng `Medicine_Inventory` lưu tồn kho thuốc:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `inventory_id` | INT | Khóa chính |
| `medicine_id` | INT | ID thuốc |
| `import_price` | DECIMAL(10,2) | Giá nhập |
| `available_stock` | INT | Số lượng tồn |
| `min_threshold` | INT | Ngưỡng cảnh báo tồn thấp |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

Bảng `Inventory_Transaction` lưu giao dịch kho:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `transaction_id` | INT | Khóa chính |
| `medicine_id` | INT | ID thuốc |
| `transaction_type` | ENUM | import, export_prescription, adjustment |
| `quantity` | INT | Số lượng giao dịch |
| `transaction_date` | DATETIME | Ngày giao dịch |
| `supplier_id` | INT | Nhà cung cấp, nếu có |
| `reference_id` | INT | Mã tham chiếu, ví dụ đơn thuốc |
| `created_by` | INT | Nhân viên tạo giao dịch |
| `notes` | TEXT | Ghi chú |
| `created_at` | DATETIME | Thời điểm tạo |

#### Appointment database - `appointment_db_vet`

Bảng `Appointment` lưu lịch hẹn:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `appointment_id` | INT | Khóa chính |
| `pet_id` | INT | Thú cưng được khám |
| `service_id` | INT | Dịch vụ đăng ký |
| `staff_id` | INT | Nhân viên/bác sĩ phụ trách |
| `appointment_date` | DATE | Ngày hẹn |
| `start_time`, `end_time` | TIME | Thời gian bắt đầu/kết thúc |
| `status` | ENUM | pending, confirmed, cancelled, completed |
| `cancellation_reason` | TEXT | Lý do hủy |
| `note` | TEXT | Ghi chú |
| `service_price` | DECIMAL(10,2) | Giá dịch vụ tại thời điểm đặt |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

#### Medical record database - `medical_record_db_vet`

Bảng `Medical_Record` lưu hồ sơ bệnh án:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `record_id` | INT | Khóa chính |
| `appointment_id` | INT | Lịch hẹn liên quan |
| `symptoms` | TEXT | Triệu chứng |
| `diagnosis` | TEXT | Chẩn đoán |
| `notes` | TEXT | Ghi chú |
| `status` | ENUM | in_progress, completed |
| `created_at`, `updated_at` | DATETIME | Thời điểm tạo/cập nhật |

Bảng `Prescription` lưu đơn thuốc:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `prescription_id` | INT | Khóa chính |
| `record_id` | INT | Hồ sơ bệnh án |
| `medicine_id` | INT | Thuốc được kê |
| `quantity` | INT | Số lượng |
| `dosage` | VARCHAR(100) | Liều dùng |
| `usage_instructions` | TEXT | Hướng dẫn sử dụng |
| `notes` | TEXT | Ghi chú |
| `created_at` | DATETIME | Thời điểm tạo |

Bảng `Re_Examination` lưu lịch tái khám đề xuất:

| Trường | Kiểu dữ liệu | Ý nghĩa |
| --- | --- | --- |
| `re_exam_id` | INT | Khóa chính |
| `record_id` | INT | Hồ sơ bệnh án |
| `suggested_date` | DATE | Ngày tái khám đề xuất |
| `reason` | VARCHAR(255) | Lý do tái khám |
| `is_booked` | BOOLEAN | Đã đặt lịch hay chưa |
| `created_at` | DATETIME | Thời điểm tạo |

### 3.3. Tập dữ liệu mẫu

File seed dữ liệu `microservices/scripts.seed.sql` tạo dữ liệu mẫu để phục vụ dashboard và kiểm thử:

- 60 tài khoản người dùng, gồm 1 admin, nhiều staff và customer.
- 30 nhân viên trong bảng `Employee`.
- 30 thú cưng.
- 30 dịch vụ.
- 30 thuốc.
- 30 nhà cung cấp.
- 30 dòng tồn kho thuốc.
- 30 lịch hẹn.
- 30 hồ sơ bệnh án.
- 30 đơn thuốc.
- 30 lịch tái khám.
- 30 giao dịch kho.

Tài khoản demo quản trị:

| Email | Mật khẩu dữ liệu seed |
| --- | --- |
| `admin@gmail.com` | Mật khẩu đã được băm trong seed data |

## 4. Giao diện và mô tả tính năng

### 4.1. Ứng dụng mobile cho khách hàng

Ứng dụng mobile nằm trong thư mục `frontend`, gồm các nhóm màn hình chính:

- Login: đăng nhập vào ứng dụng.
- Register: đăng ký tài khoản mới.
- ForgetPassword và ResetPassword: khôi phục mật khẩu.
- Home: trang chủ, hiển thị nội dung tổng quan và dịch vụ.
- ServiceList: danh sách dịch vụ.
- ServiceDetail: chi tiết dịch vụ.
- Pets: danh sách thú cưng của khách hàng.
- PetDetail: chi tiết một thú cưng.
- AddPet: thêm thú cưng mới.
- AddAppointment: đặt lịch hẹn.
- ConfirmAppointment: xác nhận thông tin trước khi tạo lịch hẹn.
- Calendar: xem lịch hẹn.
- AppointmentDetail: xem chi tiết lịch hẹn.
- Profile: xem/cập nhật hồ sơ cá nhân và đổi mật khẩu.

Luồng sử dụng cơ bản:

1. Khách hàng mở ứng dụng và đăng nhập.
2. Nếu chưa có tài khoản, khách hàng đăng ký tài khoản mới.
3. Khách hàng thêm thông tin thú cưng.
4. Khách hàng xem danh sách dịch vụ và chọn dịch vụ phù hợp.
5. Khách hàng tạo lịch hẹn cho thú cưng.
6. Hệ thống hiển thị lịch hẹn trong màn hình Calendar.
7. Khách hàng có thể xem chi tiết lịch hẹn và theo dõi trạng thái.

### 4.2. Admin dashboard cho nhân viên và quản trị viên

Admin dashboard nằm trong thư mục `admin-dashboard`. Các chức năng chính:

- Đăng nhập nội bộ.
- Dashboard báo cáo với biểu đồ và bảng thống kê.
- Quản lý lịch hẹn.
- Quản lý hồ sơ bệnh án.
- Quản lý thú cưng và khách hàng.
- Quản lý danh mục thuốc.
- Quản lý danh mục dịch vụ.
- Quản lý tồn kho thuốc.
- Quản lý nhà cung cấp.
- Quản lý giao dịch kho.
- Quản lý nhân viên.
- Quản lý tài khoản.

Bảng resource quản trị:

| Resource | Đường dẫn giao diện | Endpoint API | Chức năng |
| --- | --- | --- | --- |
| Appointments | `/appointments` | `/api/v1/appointments` | Xem, lọc, tạo/cập nhật lịch hẹn |
| Medical Records | `/medical-records` | `/api/v1/medical-records` | Quản lý hồ sơ bệnh án và đơn thuốc |
| Pets and Customers | `/pets-customers` | `/api/v1/pets` | Xem thú cưng kèm thông tin chủ nuôi |
| Medicine Catalog | `/catalog/medicine` | `/api/v1/catalog/medicines` | Quản lý danh mục thuốc |
| Service Catalog | `/catalog/service` | `/api/v1/catalog/services` | Quản lý danh mục dịch vụ |
| Medicine Inventory | `/inventory/medicine` | `/api/v1/medicine-inventory` | Quản lý tồn kho thuốc |
| Suppliers | `/inventory/suppliers` | `/api/v1/suppliers` | Quản lý nhà cung cấp |
| Inventory Transactions | `/inventory/transactions` | `/api/v1/inventory-transactions` | Quản lý giao dịch kho |
| Staff | `/staff` | `/api/v1/staff` | Quản lý nhân viên/admin |
| Account | `/account` | `/api/v1/users` | Quản lý tài khoản người dùng |

### 4.3. Phân quyền người dùng

Hệ thống có 3 vai trò:

- `customer`: sử dụng ứng dụng mobile, quản lý thông tin cá nhân, thú cưng và lịch hẹn của mình.
- `staff`: sử dụng dashboard, xử lý lịch hẹn được phân công, tạo/cập nhật hồ sơ bệnh án và đơn thuốc.
- `admin`: sử dụng dashboard, quản lý danh mục, kho, nhân viên, tài khoản, lịch hẹn và báo cáo.

Quy tắc phân quyền trên dashboard:

- Staff có quyền thao tác chủ yếu với appointments và medical-records trong phạm vi được phân công.
- Admin có quyền quản lý hầu hết resource như staff, account, catalog, inventory và supplier.
- Các route API được bảo vệ bằng JWT và middleware authorization.

## 5. Quá trình phát triển ứng dụng

### 5.1. Kiến trúc tổng quan

Hệ thống được tổ chức theo mô hình:

- Frontend mobile: ứng dụng cho khách hàng.
- Admin dashboard: ứng dụng web cho admin/staff.
- API Gateway: đầu vào chung, validate token, phân quyền và proxy request đến service phù hợp.
- Microservices:
  - AuthService: xác thực, tài khoản, profile, staff.
  - PetService: thú cưng.
  - CatalogService: dịch vụ và thuốc.
  - InventoryService: nhà cung cấp, kho thuốc và giao dịch kho.
  - AppointmentService: lịch hẹn.
  - MedicalRecordService: hồ sơ bệnh án, đơn thuốc, tái khám.
  - ReportService: báo cáo và thống kê.
- MySQL: lưu trữ dữ liệu cho từng service.

### 5.2. Cấu trúc thư mục

```text
Vet-MP/
├── admin-dashboard/        # Trang quản trị React + Vite
├── apigateway/             # API Gateway
├── frontend/               # Ứng dụng mobile React Native/Expo
├── microservices/          # Các backend service
│   ├── AuthService/
│   ├── PetService/
│   ├── CatalogService/
│   ├── InventoryService/
│   ├── AppointmentService/
│   ├── MedicalRecordService/
│   └── ReportService/
├── reset-password-web/     # Trang web đặt lại mật khẩu
├── docker-compose.yml      # Chạy toàn bộ hệ thống
└── README.md
```

### 5.3. Quy trình xử lý request

1. Frontend gửi request đến API Gateway qua prefix `/api/v1`.
2. API Gateway kiểm tra route public/protected.
3. Nếu route cần bảo vệ, Gateway xác thực JWT access token.
4. Gateway gắn thông tin identity vào header nội bộ.
5. Request được proxy đến microservice tương ứng.
6. Microservice validate dữ liệu đầu vào, kiểm tra quyền và xử lý nghiệp vụ.
7. Microservice truy vấn MySQL và trả kết quả về Gateway.
8. Gateway trả response về frontend.

### 5.4. Cài đặt và chạy hệ thống bằng Docker Compose

Yêu cầu:

- Node.js 20 trở lên.
- npm.
- Docker và Docker Compose.

Lệnh chạy toàn bộ hệ thống:

```bash
docker compose up --build
```

Sau khi chạy thành công, các cổng mặc định:

| Thành phần | Địa chỉ |
| --- | --- |
| API Gateway | `http://localhost:3000` |
| Admin dashboard | `http://localhost:8080` |
| Auth Service | `http://localhost:3001` |
| Pet Service | `http://localhost:3002` |
| Catalog Service | `http://localhost:3003` |
| Inventory Service | `http://localhost:3004` |
| Appointment Service | `http://localhost:3005` |
| Medical Record Service | `http://localhost:3006` |
| Report Service | `http://localhost:3007` |
| MySQL | `localhost:3308` |

API Gateway prefix:

```text
http://localhost:3000/api/v1
```

Dừng hệ thống:

```bash
docker compose down
```

Dừng hệ thống và xóa volume MySQL:

```bash
docker compose down -v
```

### 5.5. Chạy riêng backend

Mỗi service có thể chạy riêng trong thư mục tương ứng. Ví dụ AuthService:

```bash
cd microservices/AuthService
npm install
copy .env.example .env
npm run dev
```

API Gateway:

```bash
cd apigateway
npm install
copy .env.example .env
npm run dev
```

Cần chuẩn bị MySQL và file `.env` phù hợp nếu không dùng Docker Compose.

### 5.6. Chạy ứng dụng mobile

```bash
cd frontend
npm install
copy .env.example .env
npm start
```

Nếu backend chạy local, cấu hình:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

Một số lệnh:

```bash
npm run android
npm run ios
npm run web
```

### 5.7. Chạy admin dashboard

```bash
cd admin-dashboard
npm install
copy .env.example .env
npm run dev
```

Nếu backend chạy local, cấu hình:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Lệnh build/test:

```bash
npm run build
npm run test
```

## 6. Kiểm thử

### 6.1. Mục tiêu kiểm thử

- Đảm bảo các API chính hoạt động đúng.
- Đảm bảo middleware xác thực và phân quyền trả về đúng mã lỗi.
- Đảm bảo validate dữ liệu đầu vào đúng quy tắc.
- Đảm bảo dashboard hiển thị và xử lý state đúng.
- Đảm bảo các service có health check và có thể tích hợp qua Gateway.

### 6.2. Kiểm thử backend

Backend sử dụng Jest và Supertest. Các nhóm test hiện có:

- API Gateway:
  - Health check.
  - Proxy route public.
  - Chặn route protected khi thiếu bearer token.
  - Forward identity header đến service.
  - Chặn customer vào route admin-only.
- AuthService:
  - Validate payload đăng ký/đăng nhập.
  - Đăng nhập với payload hợp lệ.
  - Health check.
- PetService:
  - Kiểm tra identity middleware.
  - Chặn request thiếu identity.
  - Trả về danh sách thú cưng của customer.
- CatalogService:
  - Validate id, string, boolean.
  - Chuẩn hóa giá trị `is_active`.
  - Cho phép customer xem catalog.
  - Chặn customer tạo service.
- InventoryService:
  - Validate number/id.
  - Chặn non-admin.
  - Cho phép admin xem supplier.
- AppointmentService:
  - Validate giờ hẹn.
  - Kiểm tra identity và authorization.
  - Trả về lịch hẹn của customer.
- MedicalRecordService:
  - Validate dữ liệu medical record.
  - Customer xem medical record của mình.
  - Chặn customer tạo medical record.
- ReportService:
  - Chặn customer xem report.
  - Cho phép admin xem report.

Lệnh chạy test tại từng service:

```bash
npm run test
npm run test:unit
npm run test:integration
```

### 6.3. Kiểm thử admin dashboard

Admin dashboard sử dụng Vitest và Testing Library. Các nhóm test:

- Login slice: cập nhật form, lifecycle submit, clear error.
- Home slice: menu, dark mode, logout, dashboard reports.
- Admin slice: chuyển resource, lưu rows, lưu reference options, xử lý lỗi.
- Permissions: đọc quyền từ localStorage, token và role mặc định.
- Dashboard utils: map dữ liệu chart, format giá trị hiển thị, màu trạng thái lịch hẹn.
- UI integration: render login page, submit login, hiển thị lỗi và render bảng admin.

Lệnh chạy:

```bash
cd admin-dashboard
npm run test
```

### 6.4. Kịch bản kiểm thử thủ công

| STT | Kịch bản | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Đăng ký tài khoản customer mới | Tài khoản được tạo, có thể đăng nhập |
| 2 | Đăng nhập sai mật khẩu | Hệ thống báo lỗi |
| 3 | Thêm thú cưng mới | Thú cưng xuất hiện trong danh sách Pets |
| 4 | Đặt lịch hẹn | Lịch hẹn mới có trạng thái pending/confirmed tùy logic API |
| 5 | Staff cập nhật lịch hẹn | Trạng thái lịch hẹn được cập nhật |
| 6 | Staff tạo hồ sơ bệnh án | Medical record và prescription được lưu |
| 7 | Admin thêm dịch vụ | Dịch vụ mới hiện trong catalog |
| 8 | Admin thêm thuốc và tồn kho | Thuốc và tồn kho được hiển thị trong dashboard |
| 9 | Admin xem báo cáo | Biểu đồ và bảng thống kê hiển thị dữ liệu seed |
| 10 | Customer truy cập API admin-only | API trả về lỗi không có quyền |

## 7. Hướng dẫn người dùng

### 7.1. Hướng dẫn cho khách hàng

1. Mở ứng dụng Vet-MP.
2. Chọn Register nếu chưa có tài khoản, nhập họ tên, email/số điện thoại và mật khẩu.
3. Đăng nhập vào ứng dụng.
4. Vào tab Pets để thêm hồ sơ thú cưng.
5. Vào Home hoặc ServiceList để xem các dịch vụ phòng khám.
6. Chọn dịch vụ, sau đó tạo lịch hẹn cho thú cưng.
7. Kiểm tra thông tin tại màn hình ConfirmAppointment và xác nhận.
8. Vào Calendar để xem lịch hẹn.
9. Vào AppointmentDetail để xem chi tiết trạng thái lịch hẹn.
10. Vào Profile để cập nhật thông tin cá nhân hoặc đổi mật khẩu.

### 7.2. Hướng dẫn cho nhân viên

1. Truy cập admin dashboard tại `http://localhost:8080`.
2. Đăng nhập bằng tài khoản staff.
3. Vào Appointments để xem lịch hẹn được phân công.
4. Tìm kiếm hoặc lọc lịch hẹn theo trạng thái.
5. Cập nhật trạng thái lịch hẹn khi tiếp nhận, hủy hoặc hoàn thành.
6. Vào Medical Records để tạo hồ sơ bệnh án cho lịch khám.
7. Nhập triệu chứng, chẩn đoán, ghi chú và đơn thuốc nếu có.
8. Kiểm tra lại chi tiết hồ sơ bệnh án và prescription.

### 7.3. Hướng dẫn cho quản trị viên

1. Truy cập admin dashboard tại `http://localhost:8080`.
2. Đăng nhập bằng tài khoản admin.
3. Xem Dashboard để nắm tình hình tổng quan.
4. Vào Staff để thêm/sửa/vô hiệu hóa nhân viên.
5. Vào Account để quản lý tài khoản người dùng.
6. Vào Service Catalog để thêm/sửa dịch vụ.
7. Vào Medicine Catalog để thêm/sửa thuốc.
8. Vào Suppliers để quản lý nhà cung cấp.
9. Vào Medicine Inventory để cập nhật tồn kho.
10. Vào Inventory Transactions để ghi nhận giao dịch nhập, xuất hoặc điều chỉnh.
11. Vào Reports/Dashboard để theo dõi doanh thu, top dịch vụ, tồn kho thấp và lịch hẹn bị hủy.

## 8. Kết luận

### 8.1. Những điều đã làm được

- Xây dựng được hệ thống quản lý phòng khám thú y với đầy đủ các thành phần chính: ứng dụng mobile cho khách hàng, admin dashboard cho nhân viên/quản trị viên, API Gateway, các microservice nghiệp vụ và cơ sở dữ liệu MySQL.
- Hoàn thành các chức năng cơ bản cho khách hàng như đăng ký, đăng nhập, quên mật khẩu, quản lý hồ sơ cá nhân, quản lý thú cưng, xem dịch vụ và đặt lịch hẹn.
- Hoàn thành các chức năng cho nhân viên như xem lịch hẹn được phân công, cập nhật trạng thái lịch hẹn, tạo hồ sơ bệnh án và kê đơn thuốc.
- Hoàn thành các chức năng cho quản trị viên như quản lý tài khoản, nhân viên, danh mục dịch vụ, danh mục thuốc, nhà cung cấp, tồn kho, giao dịch kho và báo cáo.
- Xây dựng dashboard báo cáo với các biểu đồ và bảng thống kê phục vụ theo dõi doanh thu, lịch hẹn, người dùng, thú cưng và tồn kho.
- Thiết kế CSDL tách theo từng miền nghiệp vụ, phù hợp với kiến trúc microservices.
- Tích hợp xác thực và phân quyền bằng JWT, middleware authorization và phân quyền theo vai trò admin, staff, customer.
- Cấu hình Docker Compose để có thể chạy MySQL, seed data, các microservice, API Gateway và admin dashboard trong cùng một môi trường.
- Viết unit test và integration test cho nhiều thành phần quan trọng như middleware, validation, API Gateway, service API, Redux slice, permission và UI dashboard.

### 8.2. Những điều chưa làm được

- Chưa tích hợp chức năng thanh toán online cho lịch hẹn, đơn thuốc hoặc hóa đơn.
- Chưa có module hóa đơn, công nợ và quản lý thanh toán chi tiết.
- Chưa có hệ thống thông báo tự động qua email, SMS hoặc push notification để nhắc lịch hẹn/tái khám.
- Chưa có module quản lý lịch làm việc, ca trực và lịch nghỉ của bác sĩ/nhân viên.
- Chưa triển khai upload ảnh qua cloud storage; avatar hiện vẫn có thể lưu dạng chuỗi trong database.
- Chưa có audit log đầy đủ để theo dõi lịch sử thao tác của admin/staff.
- Chưa tối ưu đầy đủ cho môi trường production như monitoring, logging tập trung, backup tự động và CI/CD hoàn chỉnh.
- Chưa có phân quyền RBAC chi tiết đến từng permission nâng cao cho toàn bộ nghiệp vụ.
- Chưa hỗ trợ đa ngôn ngữ và chế độ offline cho ứng dụng mobile.

## 9. Hướng phát triển kế tiếp của đồ án

- Bổ sung chức năng thanh toán online cho lịch hẹn và đơn thuốc.
- Bổ sung module hóa đơn và quản lý công nợ.
- Gửi thông báo lịch hẹn qua email, SMS hoặc push notification.
- Quản lý lịch làm việc, ca trực và lịch nghỉ của bác sĩ/nhân viên.
- Bổ sung upload ảnh qua cloud storage thay vì lưu avatar dạng chuỗi trong database.
- Bổ sung tìm kiếm nâng cao và phân trang đồng bộ trên toàn bộ dashboard.
- Bổ sung audit log để theo dõi lịch sử thao tác của admin/staff.
- Cải tiến báo cáo doanh thu theo ngày, tháng, năm và theo nhân viên phụ trách.
- Bổ sung RBAC chi tiết hơn theo permission cho từng hành động.
- Triển khai CI/CD, monitoring, logging tập trung và backup database định kỳ.
- Tối ưu UX mobile, hỗ trợ đa ngôn ngữ và chế độ offline hạn chế cho một số màn hình.

## 10. Tài liệu tham khảo

- React Native Documentation: https://reactnative.dev/
- Expo Documentation: https://docs.expo.dev/
- React Documentation: https://react.dev/
- Vite Documentation: https://vite.dev/
- TypeScript Documentation: https://www.typescriptlang.org/docs/
- Express Documentation: https://expressjs.com/
- MySQL Documentation: https://dev.mysql.com/doc/
- Docker Documentation: https://docs.docker.com/
- Jest Documentation: https://jestjs.io/docs/getting-started
- Vitest Documentation: https://vitest.dev/
- Material UI Documentation: https://mui.com/
- Refine Documentation: https://refine.dev/docs/
- Recharts Documentation: https://recharts.org/
- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
