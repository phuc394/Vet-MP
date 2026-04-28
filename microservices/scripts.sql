
CREATE DATABASE IF NOT EXISTS auth_db_vet;
USE auth_db_vet;

-- Bảng Users (Người dùng hệ thống)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'customer') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    avatar VARCHAR(255) NULL,
    address TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Employee (Hồ sơ nhân viên chuyên môn)
CREATE TABLE Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    position VARCHAR(50) NULL,
    license_number VARCHAR(50) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE DATABASE IF NOT EXISTS pet_db_vet;
USE pet_db_vet;

-- Bảng Pet (Hồ sơ thú cưng)
CREATE TABLE Pet (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL, -- [REFERENCE] Tham chiếu logic tới auth_db_vet.Users.user_id
    name VARCHAR(50) NOT NULL,
    species VARCHAR(50) NULL,
    breed VARCHAR(50) NULL,
    birth_date DATE NULL,
    weight DECIMAL(5,2) NULL,
    notes TEXT NULL,
    avatar VARCHAR(255) NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner_id (owner_id) -- Thêm index để tối ưu truy vấn theo chủ nuôi
);
CREATE DATABASE IF NOT EXISTS catalog_db_vet;
USE catalog_db_vet;

-- Bảng Service (Danh mục dịch vụ khám)
CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Medicine (Danh mục thuốc)
CREATE TABLE Medicine (
    medicine_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    ingredients TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE DATABASE IF NOT EXISTS inventory_db_vet;
USE inventory_db_vet;

-- Bảng Supplier (Nhà cung cấp)
CREATE TABLE Supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(255) NULL,
    address TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Medicine_Inventory (Tồn kho thuốc)
CREATE TABLE Medicine_Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id INT UNIQUE NOT NULL, -- [REFERENCE] Tham chiếu logic tới catalog_db_vet.Medicine.medicine_id
    import_price DECIMAL(10,2) NULL,
    available_stock INT DEFAULT 0,
    min_threshold INT DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_medicine_id (medicine_id)
);

-- Bảng Inventory_Transaction (Lịch sử nhập/xuất kho)
CREATE TABLE Inventory_Transaction (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id INT NOT NULL, -- [REFERENCE] Tham chiếu logic tới catalog_db_vet.Medicine.medicine_id
    transaction_type ENUM('import', 'export_prescription', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    transaction_date DATETIME NOT NULL,
    supplier_id INT NULL,
    reference_id INT NULL, -- [REFERENCE] Tham chiếu logic tới medical_record_db_vet.Prescription.prescription_id
    created_by INT NOT NULL, -- [REFERENCE] Tham chiếu logic tới auth_db_vet.Users.user_id
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_medicine_id (medicine_id),
    INDEX idx_created_by (created_by),
    INDEX idx_reference_id (reference_id)
);

CREATE DATABASE IF NOT EXISTS appointment_db_vet;
USE appointment_db_vet;

-- Bảng Appointment (Lịch hẹn khám)
CREATE TABLE Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL, -- [REFERENCE] Tham chiếu logic tới pet_db_vet.Pet.pet_id
    service_id INT NOT NULL, -- [REFERENCE] Tham chiếu logic tới catalog_db_vet.Service.service_id
    staff_id INT NULL, -- [REFERENCE] Tham chiếu logic tới auth_db_vet.Users.user_id (Lọc role='staff' ở tầng Code)
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    cancellation_reason TEXT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pet_id (pet_id),
    INDEX idx_service_id (service_id),
    INDEX idx_staff_id (staff_id),
    INDEX idx_appointment_date (appointment_date, start_time) -- Tối ưu tìm lịch trống
);

CREATE DATABASE IF NOT EXISTS medical_record_db_vet;
USE medical_record_db_vet;

-- Bảng Medical_Record (Bệnh án / Hồ sơ khám bệnh)
CREATE TABLE Medical_Record (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT UNIQUE NOT NULL, -- [REFERENCE] Tham chiếu logic tới appointment_db_vet.Appointment.appointment_id
    symptoms TEXT NULL,
    diagnosis TEXT NULL,
    notes TEXT NULL,
    status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_appointment_id (appointment_id)
);

-- Bảng Prescription (Đơn thuốc đã kê)
CREATE TABLE Prescription (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    medicine_id INT NOT NULL, -- [REFERENCE] Tham chiếu logic tới catalog_db_vet.Medicine.medicine_id
    quantity INT NOT NULL,
    dosage VARCHAR(100) NULL,
    usage_instructions TEXT NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES Medical_Record(record_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_medicine_id (medicine_id)
);

-- Bảng Re_Examination (Lịch tái khám được chỉ định)
CREATE TABLE Re_Examination (
    re_exam_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    suggested_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES Medical_Record(record_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_suggested_date (suggested_date)
);


