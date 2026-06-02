CREATE DATABASE IF NOT EXISTS auth_db_vet;
USE auth_db_vet;

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

CREATE TABLE Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    position VARCHAR(50) NULL,
    license_number VARCHAR(50) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE RefreshTokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_token_user
    FOREIGN KEY (user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE
);

CREATE DATABASE IF NOT EXISTS pet_db_vet;
USE pet_db_vet;

CREATE TABLE Pet (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    sex ENUM('male', 'female') NOT NULL,
    species VARCHAR(50) NULL,
    breed VARCHAR(50) NULL,
    birth_date DATE NULL,
    weight DECIMAL(5,2) NULL,
    notes TEXT NULL,
    avatar VARCHAR(255) NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner_id (owner_id)
);

CREATE DATABASE IF NOT EXISTS catalog_db_vet;
USE catalog_db_vet;

CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

CREATE TABLE Supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(255) NULL,
    address TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Medicine_Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id INT UNIQUE NOT NULL,
    import_price DECIMAL(10,2) NULL,
    available_stock INT DEFAULT 0,
    min_threshold INT DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_medicine_id (medicine_id)
);

CREATE TABLE Inventory_Transaction (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id INT NOT NULL,
    transaction_type ENUM('import', 'export_prescription', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    transaction_date DATETIME NOT NULL,
    supplier_id INT NULL,
    reference_id INT NULL,
    created_by INT NOT NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_medicine_id (medicine_id),
    INDEX idx_created_by (created_by),
    INDEX idx_reference_id (reference_id)
);

CREATE DATABASE IF NOT EXISTS appointment_db_vet;
USE appointment_db_vet;

CREATE TABLE Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    service_id INT NOT NULL,
    staff_id INT NULL,
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
    INDEX idx_appointment_date (appointment_date, start_time)
);

ALTER TABLE appointment_db_vet.Appointment
    ADD COLUMN note TEXT NULL AFTER cancellation_reason;

CREATE DATABASE IF NOT EXISTS medical_record_db_vet;
USE medical_record_db_vet;

CREATE TABLE Medical_Record (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT UNIQUE NOT NULL,
    symptoms TEXT NULL,
    diagnosis TEXT NULL,
    notes TEXT NULL,
    status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_appointment_id (appointment_id)
);

CREATE TABLE Prescription (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    medicine_id INT NOT NULL,
    quantity INT NOT NULL,
    dosage VARCHAR(100) NULL,
    usage_instructions TEXT NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES Medical_Record(record_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_medicine_id (medicine_id)
);

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

-- Seed data for dashboard/report visualization.
-- RefreshTokens is intentionally excluded.
DROP TEMPORARY TABLE IF EXISTS seed_numbers;
CREATE TEMPORARY TABLE seed_numbers (n INT PRIMARY KEY);

INSERT INTO seed_numbers (n) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15),(16),(17),(18),(19),(20),
(21),(22),(23),(24),(25),(26),(27),(28),(29),(30),
(31),(32),(33),(34),(35),(36),(37),(38),(39),(40),
(41),(42),(43),(44),(45),(46),(47),(48),(49),(50),
(51),(52),(53),(54),(55),(56),(57),(58),(59),(60);

INSERT INTO auth_db_vet.Users (
    user_id, full_name, phone_number, email, password_hash, role, status, avatar, address, created_at
)
SELECT
    n,
    CASE
        WHEN n = 1 THEN 'Demo Admin'
        WHEN n <= 30 THEN CONCAT('Staff Member ', LPAD(n - 1, 2, '0'))
        ELSE CONCAT('Customer ', LPAD(n - 30, 2, '0'))
    END,
    CASE
        WHEN n = 1 THEN 'admin-demo'
        WHEN n <= 30 THEN CONCAT('09010', LPAD(n, 5, '0'))
        ELSE CONCAT('09110', LPAD(n - 30, 5, '0'))
    END,
    CASE
        WHEN n = 1 THEN 'admin@gmail.com'
        WHEN n <= 30 THEN CONCAT('staff', LPAD(n - 1, 2, '0'), '@vet.test')
        ELSE CONCAT('customer', LPAD(n - 30, 2, '0'), '@vet.test')
    END,
    '$2b$10$V8pYQ7HTYh8rT9NwIeMCbO9a6ye0iP3LP6MSFEH5MII6FqR4jKhCi',
    CASE WHEN n = 1 THEN 'admin' WHEN n <= 30 THEN 'staff' ELSE 'customer' END,
    CASE WHEN n IN (14, 28, 46, 55) THEN 'inactive' ELSE 'active' END,
    NULL,
    CONCAT('District ', ((n - 1) % 12) + 1, ', Ho Chi Minh City'),
    DATE_ADD('2026-01-01', INTERVAL (n - 1) DAY)
FROM seed_numbers
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    phone_number = VALUES(phone_number),
    email = VALUES(email),
    password_hash = VALUES(password_hash),
    role = VALUES(role),
    status = VALUES(status),
    address = VALUES(address);

INSERT INTO auth_db_vet.Employee (
    employee_id, user_id, position, license_number
)
SELECT
    n,
    n,
    ELT(((n - 1) % 5) + 1, 'Veterinarian', 'Nurse', 'Receptionist', 'Pharmacist', 'Clinic Manager'),
    CONCAT('VET-LIC-', LPAD(n, 4, '0'))
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    position = VALUES(position),
    license_number = VALUES(license_number);

INSERT INTO pet_db_vet.Pet (
    pet_id, owner_id, name, sex, species, breed, birth_date, weight, notes, avatar, is_deleted, created_at
)
SELECT
    n,
    30 + n,
    CONCAT(ELT(((n - 1) % 10) + 1, 'Milo', 'Luna', 'Coco', 'Max', 'Bella', 'Charlie', 'Nala', 'Rocky', 'Mochi', 'Simba'), ' ', n),
    CASE WHEN n % 2 = 0 THEN 'female' ELSE 'male' END,
    ELT(((n - 1) % 5) + 1, 'Dog', 'Cat', 'Rabbit', 'Bird', 'Hamster'),
    ELT(((n - 1) % 6) + 1, 'Poodle', 'British Shorthair', 'Mini Lop', 'Parrot', 'Syrian', 'Mixed'),
    DATE_SUB('2026-05-01', INTERVAL (180 + n * 27) DAY),
    ROUND(2.5 + (n * 1.37), 2),
    'Seed pet profile for dashboard reports',
    NULL,
    CASE WHEN n IN (29, 30) THEN TRUE ELSE FALSE END,
    DATE_ADD('2026-02-01', INTERVAL (n - 1) DAY)
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    owner_id = VALUES(owner_id),
    name = VALUES(name),
    sex = VALUES(sex),
    species = VALUES(species),
    breed = VALUES(breed),
    birth_date = VALUES(birth_date),
    weight = VALUES(weight),
    notes = VALUES(notes),
    is_deleted = VALUES(is_deleted);

INSERT INTO catalog_db_vet.Service (
    service_id, name, description, price, is_active
)
SELECT
    n,
    CONCAT(
        ELT(((n - 1) % 10) + 1, 'General Checkup', 'Vaccination', 'Dental Cleaning', 'Dermatology', 'Surgery Consult', 'Ultrasound', 'Blood Test', 'Emergency Care', 'Grooming', 'Nutrition Plan'),
        ' Package ',
        FLOOR((n - 1) / 10) + 1
    ),
    CONCAT('Seed service used for revenue chart category ', ((n - 1) % 10) + 1),
    120000 + (n * 35000),
    CASE WHEN n IN (29, 30) THEN FALSE ELSE TRUE END
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    is_active = VALUES(is_active);

INSERT INTO catalog_db_vet.Medicine (
    medicine_id, name, unit, selling_price, ingredients, is_active
)
SELECT
    n,
    CONCAT(
        ELT(((n - 1) % 10) + 1, 'AmoxiVet', 'ParaPet', 'DentaClean', 'SkinGuard', 'WormFree', 'EyeCare', 'EarDrop', 'JointFlex', 'NutriBoost', 'CalmPet'),
        ' ',
        FLOOR((n - 1) / 10) + 1
    ),
    ELT(((n - 1) % 5) + 1, 'tablet', 'bottle', 'tube', 'vial', 'pack'),
    25000 + (n * 7500),
    CONCAT('Active ingredient group ', ((n - 1) % 8) + 1),
    CASE WHEN n IN (28, 30) THEN FALSE ELSE TRUE END
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    unit = VALUES(unit),
    selling_price = VALUES(selling_price),
    ingredients = VALUES(ingredients),
    is_active = VALUES(is_active);

INSERT INTO inventory_db_vet.Supplier (
    supplier_id, name, contact_info, address
)
SELECT
    n,
    CONCAT('Vet Supplier ', LPAD(n, 2, '0')),
    CONCAT('supplier', LPAD(n, 2, '0'), '@vet.test | 028', LPAD(n, 7, '0')),
    CONCAT('Warehouse Zone ', ((n - 1) % 6) + 1)
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    contact_info = VALUES(contact_info),
    address = VALUES(address);

INSERT INTO inventory_db_vet.Medicine_Inventory (
    inventory_id, medicine_id, import_price, available_stock, min_threshold
)
SELECT
    n,
    n,
    15000 + (n * 5200),
    CASE
        WHEN n % 7 = 0 THEN 3 + (n % 4)
        WHEN n % 5 = 0 THEN 8 + (n % 5)
        ELSE 20 + (n * 4)
    END,
    CASE WHEN n % 7 = 0 THEN 8 ELSE 10 + (n % 6) END
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    medicine_id = VALUES(medicine_id),
    import_price = VALUES(import_price),
    available_stock = VALUES(available_stock),
    min_threshold = VALUES(min_threshold);

INSERT INTO appointment_db_vet.Appointment (
    appointment_id, pet_id, service_id, staff_id, appointment_date, start_time, end_time,
    status, cancellation_reason, note, service_price, created_at
)
SELECT
    n,
    n,
    n,
    ((n - 1) % 29) + 2,
    DATE_ADD('2026-05-01', INTERVAL (n - 1) DAY),
    MAKETIME(8 + ((n - 1) % 8), CASE WHEN n % 2 = 0 THEN 30 ELSE 0 END, 0),
    MAKETIME(9 + ((n - 1) % 8), CASE WHEN n % 2 = 0 THEN 30 ELSE 0 END, 0),
    CASE
        WHEN n IN (6, 13, 20, 27) THEN 'cancelled'
        WHEN n IN (5, 10, 15, 25, 30) THEN 'pending'
        WHEN n IN (4, 8, 12, 16, 24, 28) THEN 'confirmed'
        ELSE 'completed'
    END,
    CASE
        WHEN n IN (6, 13, 20, 27) THEN ELT(((n - 1) % 4) + 1, 'Owner unavailable', 'Pet recovered', 'Schedule conflict', 'Changed clinic')
        ELSE NULL
    END,
    ELT(((n - 1) % 6) + 1,
        'Owner requested a routine wellness check.',
        'Pet has been eating less than usual.',
        'Please check vaccination status during the visit.',
        'Pet may be nervous around other animals.',
        'Follow-up requested after recent treatment.',
        'Owner prefers a morning appointment.'
    ),
    120000 + (n * 35000),
    DATE_ADD('2026-04-20', INTERVAL (n - 1) DAY)
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    pet_id = VALUES(pet_id),
    service_id = VALUES(service_id),
    staff_id = VALUES(staff_id),
    appointment_date = VALUES(appointment_date),
    start_time = VALUES(start_time),
    end_time = VALUES(end_time),
    status = VALUES(status),
    cancellation_reason = VALUES(cancellation_reason),
    note = VALUES(note),
    service_price = VALUES(service_price);

INSERT INTO medical_record_db_vet.Medical_Record (
    record_id, appointment_id, symptoms, diagnosis, notes, status, created_at
)
SELECT
    n,
    n,
    ELT(((n - 1) % 6) + 1, 'Fever and fatigue', 'Skin irritation', 'Dental plaque', 'Digestive issue', 'Limping', 'Routine wellness exam'),
    ELT(((n - 1) % 6) + 1, 'Mild infection', 'Allergy', 'Dental disease', 'Gastritis', 'Soft tissue strain', 'Healthy'),
    CONCAT('Seed medical record ', n),
    CASE WHEN n IN (5, 10, 15, 25, 30) THEN 'in_progress' ELSE 'completed' END,
    DATE_ADD('2026-05-01', INTERVAL (n - 1) DAY)
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    appointment_id = VALUES(appointment_id),
    symptoms = VALUES(symptoms),
    diagnosis = VALUES(diagnosis),
    notes = VALUES(notes),
    status = VALUES(status);

INSERT INTO medical_record_db_vet.Prescription (
    prescription_id, record_id, medicine_id, quantity, dosage, usage_instructions, notes
)
SELECT
    n,
    n,
    n,
    1 + (n % 5),
    ELT(((n - 1) % 4) + 1, '1 tablet daily', '2 ml twice daily', 'Apply once daily', 'Use after meals'),
    'Follow veterinarian instruction for 5-7 days',
    CONCAT('Prescription seed row ', n)
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    record_id = VALUES(record_id),
    medicine_id = VALUES(medicine_id),
    quantity = VALUES(quantity),
    dosage = VALUES(dosage),
    usage_instructions = VALUES(usage_instructions),
    notes = VALUES(notes);

INSERT INTO medical_record_db_vet.Re_Examination (
    re_exam_id, record_id, suggested_date, reason, is_booked
)
SELECT
    n,
    n,
    DATE_ADD('2026-06-01', INTERVAL (n - 1) DAY),
    ELT(((n - 1) % 5) + 1, 'Follow-up vaccination', 'Check treatment response', 'Dental review', 'Skin progress review', 'Routine monitoring'),
    CASE WHEN n % 3 = 0 THEN TRUE ELSE FALSE END
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    record_id = VALUES(record_id),
    suggested_date = VALUES(suggested_date),
    reason = VALUES(reason),
    is_booked = VALUES(is_booked);

INSERT INTO inventory_db_vet.Inventory_Transaction (
    transaction_id, medicine_id, transaction_type, quantity, transaction_date,
    supplier_id, reference_id, created_by, notes
)
SELECT
    n,
    n,
    ELT(((n - 1) % 3) + 1, 'import', 'export_prescription', 'adjustment'),
    5 + (n * 2),
    DATE_ADD('2026-05-01', INTERVAL (n - 1) DAY),
    CASE WHEN ((n - 1) % 3) + 1 = 1 THEN n ELSE NULL END,
    CASE WHEN ((n - 1) % 3) + 1 = 2 THEN n ELSE NULL END,
    ((n - 1) % 29) + 2,
    CONCAT('Seed inventory transaction ', n)
FROM seed_numbers
WHERE n <= 30
ON DUPLICATE KEY UPDATE
    medicine_id = VALUES(medicine_id),
    transaction_type = VALUES(transaction_type),
    quantity = VALUES(quantity),
    transaction_date = VALUES(transaction_date),
    supplier_id = VALUES(supplier_id),
    reference_id = VALUES(reference_id),
    created_by = VALUES(created_by),
    notes = VALUES(notes);

DROP TEMPORARY TABLE IF EXISTS seed_numbers;
