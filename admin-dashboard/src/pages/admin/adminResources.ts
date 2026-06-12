import { TableColumn } from "../../components/admin/DataTable";
import { FormField } from "../../components/admin/ResourceForm";
import { privateAxios } from "../../utils/axios";
import { getCurrentRole, getCurrentUserId } from "./permissions";

export type AdminRecord = Record<string, unknown>;

export type PermissionAction = "create" | "edit" | "delete";

export type AdminResource = {
    key: string;
    title: string;
    path: string;
    endpoint: string;
    idField: string;
    columns: TableColumn<AdminRecord>[];
    formFields: FormField[];
    filterField?: string;
    filterOptions?: string[];
    searchKeys: string[];
    createEndpoint?: string;
    updateEndpoint?: string;
    deleteEndpoint?: string;
    deleteMethod?: "delete" | "patch";
    deletePath?: (row: AdminRecord) => string;
    createRecord?: (values: AdminRecord) => Promise<void>;
    createPayload?: (values: AdminRecord) => AdminRecord;
    updatePayload?: (values: AdminRecord) => AdminRecord;
    loadRows?: () => Promise<AdminRecord[]>;
    loadDetails?: (row: AdminRecord) => Promise<{ data: AdminRecord; sections?: DetailSection[] }>;
    allowCreate?: boolean;
    allowEdit?: boolean;
    allowDelete?: boolean;
    canDeleteRow?: (row: AdminRecord) => boolean;
    extraActionLabel?: string;
};

export type DetailSection = {
    title: string;
    rows: AdminRecord[];
};

const value = (row: AdminRecord, key: string) => row[key] ?? "-";

const formatDate = (dateValue: unknown) => {
    if (dateValue === null || dateValue === undefined || dateValue === "") {
        return "-";
    }

    const date = new Date(dateValue as string | number | Date);
    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const shouldFormatAsDate = (key: string) => key.includes("date") || key.endsWith("_at");

const column = (key: string, header: string): TableColumn<AdminRecord> => ({
    key,
    header,
    render: (row) => shouldFormatAsDate(key) ? formatDate(value(row, key)) : String(value(row, key)),
});

const unwrapRows = (response: unknown): AdminRecord[] => {
    const payload = response as { data?: unknown };
    const body = payload.data as { data?: unknown } | unknown[];
    const data = Array.isArray(body) ? body : (body as { data?: unknown })?.data;
    if (Array.isArray(data)) {
        return data as AdminRecord[];
    }
    return [];
};

const unwrapRecord = (response: unknown): AdminRecord => {
    const payload = response as { data?: unknown };
    const body = payload.data as { data?: unknown } | AdminRecord;
    const data = (body as { data?: unknown })?.data ?? body;
    if (Array.isArray(data)) {
        return (data[0] ?? {}) as AdminRecord;
    }
    return (data ?? {}) as AdminRecord;
};

const toNumber = (valueToConvert: unknown) => {
    if (valueToConvert === "" || valueToConvert === null || valueToConvert === undefined) {
        return undefined;
    }
    const parsed = Number(valueToConvert);
    return Number.isNaN(parsed) ? valueToConvert : parsed;
};

const cleanPayload = (values: AdminRecord) => {
    return Object.entries(values).reduce<AdminRecord>((payload, [key, item]) => {
        if (item !== "" && item !== undefined) {
            payload[key] = ["pet_id", "service_id", "staff_id", "owner_id", "appointment_id", "record_id", "medicine_id", "quantity", "stock_quantity", "unit_price", "import_quantity", "supplier_id", "weight", "selling_price", "price", "import_price", "available_stock", "min_threshold", "reference_id", "created_by"].includes(key)
                ? toNumber(item)
                : item;
        }
        return payload;
    }, {});
};

const isCurrentStaff = () => getCurrentRole() === "staff";

const ownStaffId = () => getCurrentUserId();

const getAll = async (endpoint: string) => unwrapRows(await privateAxios.get(endpoint));
const getOne = async (endpoint: string, id: string | number) => unwrapRecord(await privateAxios.get(`${endpoint}/${id}`));
const tryGetAll = async (endpoint: string) => {
    try {
        return await getAll(endpoint);
    } catch {
        return [];
    }
};

const labelOf = (row: AdminRecord, keys: string[], fallback: string) => {
    const found = keys.map((key) => row[key]).find((item) => item !== undefined && item !== null && item !== "");
    return String(found ?? fallback);
};

const getRelationshipLookups = async () => {
    const [pets, services, staff, medicines, suppliers] = await Promise.all([
        tryGetAll("/api/v1/pets"),
        tryGetAll("/api/v1/catalog/services"),
        isCurrentStaff() ? Promise.resolve([]) : tryGetAll("/api/v1/staff"),
        tryGetAll("/api/v1/catalog/medicines"),
        tryGetAll("/api/v1/suppliers"),
    ]);

    return {
        pets: new Map(pets.map((pet) => [String(pet.pet_id), labelOf(pet, ["name"], `Pet #${pet.pet_id}`)])),
        services: new Map(services.map((service) => [String(service.service_id), labelOf(service, ["name"], `Service #${service.service_id}`)])),
        staff: new Map(staff.map((person) => [String(person.user_id), labelOf(person, ["full_name", "email"], `Staff #${person.user_id}`)])),
        medicines: new Map(medicines.map((medicine) => [String(medicine.medicine_id), labelOf(medicine, ["name"], `Medicine #${medicine.medicine_id}`)])),
        suppliers: new Map(suppliers.map((supplier) => [String(supplier.supplier_id), labelOf(supplier, ["name"], `Supplier #${supplier.supplier_id}`)])),
    };
};

const loadAppointmentsWithNames = async (): Promise<AdminRecord[]> => {
    const [appointments, lookups] = await Promise.all([
        getAll("/api/v1/appointments"),
        getRelationshipLookups(),
    ]);

    return appointments
        .filter((appointment) => !isCurrentStaff() || String(appointment.staff_id) === String(ownStaffId()))
        .map((appointment) => ({
            ...appointment,
            pet_name: lookups.pets.get(String(appointment.pet_id)) ?? `Pet #${appointment.pet_id}`,
            service_name: lookups.services.get(String(appointment.service_id)) ?? `Service #${appointment.service_id}`,
            staff_name: lookups.staff.get(String(appointment.staff_id)) ?? `Staff #${appointment.staff_id}`,
        }));
};

const loadMedicalRecordsWithAppointmentNames = async (): Promise<AdminRecord[]> => {
    const [records, appointments] = await Promise.all([
        getAll("/api/v1/medical-records"),
        loadAppointmentsWithNames(),
    ]);
    const appointmentDates = new Map(appointments.map((appointment) => [String(appointment.appointment_id), appointment.appointment_date]));
    const appointmentStaff = new Map(appointments.map((appointment) => [String(appointment.appointment_id), appointment.staff_id]));

    return records
        .filter((record) => !isCurrentStaff() || String(appointmentStaff.get(String(record.appointment_id))) === String(ownStaffId()))
        .map((record) => ({
            ...record,
            appointment_date: appointmentDates.get(String(record.appointment_id)) ?? "-",
        }));
};

const loadPetsWithOwners = async () => {
    const [pets, users] = await Promise.all([
        getAll("/api/v1/pets"),
        getAll("/api/v1/users"),
    ]);
    const owners = new Map(users.map((user) => [String(user.user_id), user.full_name]));
    return pets.map((pet) => ({
        ...pet,
        owner_full_name: owners.get(String(pet.owner_id)) ?? "Unknown owner",
    }));
};

const loadMedicineInventoryWithNames = async (): Promise<AdminRecord[]> => {
    const [inventory, lookups] = await Promise.all([
        getAll("/api/v1/medicine-inventory"),
        getRelationshipLookups(),
    ]);

    return inventory.map((item) => ({
        ...item,
        medicine_name: lookups.medicines.get(String(item.medicine_id)) ?? `Medicine #${item.medicine_id}`,
    }));
};

const loadInventoryTransactionsWithNames = async (): Promise<AdminRecord[]> => {
    const [transactions, lookups] = await Promise.all([
        getAll("/api/v1/inventory-transactions"),
        getRelationshipLookups(),
    ]);

    return transactions.map((transaction) => ({
        ...transaction,
        medicine_name: lookups.medicines.get(String(transaction.medicine_id)) ?? `Medicine #${transaction.medicine_id}`,
        supplier_name: transaction.supplier_id
            ? lookups.suppliers.get(String(transaction.supplier_id)) ?? `Supplier #${transaction.supplier_id}`
            : "-",
        created_by_name: lookups.staff.get(String(transaction.created_by)) ?? `Staff #${transaction.created_by}`,
    }));
};

const detailRowsByField = async (endpoint: string, field: string, valueToMatch: unknown) => {
    const rows = await getAll(endpoint);
    return rows.filter((row) => String(row[field]) === String(valueToMatch));
};

const formatMedicalRecordName = (record: AdminRecord) => {
    const diagnosis = record.diagnosis ? `Diagnosis: ${record.diagnosis}` : "Medical record";
    return `${diagnosis} (#${record.record_id})`;
};

const enrichPrescriptions = async (prescriptions: AdminRecord[], record?: AdminRecord) => {
    const medicines = await getAll("/api/v1/catalog/medicines");
    const medicineNames = new Map(
        medicines.map((medicine) => [
            String(medicine.medicine_id),
            labelOf(medicine, ["name"], `Medicine #${medicine.medicine_id}`),
        ]),
    );
    const recordName = record ? formatMedicalRecordName(record) : undefined;

    return prescriptions.map(({ record_id, medicine_id, ...prescription }) => ({
        ...prescription,
        medical_record: recordName ?? `Medical Record #${record_id}`,
        medicine: medicineNames.get(String(medicine_id)) ?? `Medicine #${medicine_id}`,
    }));
};

const enrichReExaminations = (reExaminations: AdminRecord[], records: AdminRecord[]) => {
    const recordNames = new Map(records.map((record) => [String(record.record_id), formatMedicalRecordName(record)]));

    return reExaminations.map(({ record_id, ...reExamination }) => ({
        ...reExamination,
        medical_record: recordNames.get(String(record_id)) ?? `Medical Record #${record_id}`,
    }));
};

const createMedicalRecordWithPrescription = async (values: AdminRecord) => {
    const medicalRecordPayload = cleanPayload({
        appointment_id: values.appointment_id,
        symptoms: values.symptoms,
        diagnosis: values.diagnosis,
        notes: values.notes,
        status: values.status,
    });

    const record = unwrapRecord(await privateAxios.post("/api/v1/medical-records", medicalRecordPayload));
    const recordId = record.record_id;

    const prescriptions = Array.isArray(values.prescriptions)
        ? values.prescriptions as AdminRecord[]
        : [];
    const validPrescriptions = prescriptions.filter((prescription) => prescription.medicine_id);

    if (!recordId || validPrescriptions.length === 0) {
        return;
    }

    await Promise.all(validPrescriptions.map((prescription) =>
        privateAxios.post("/api/v1/prescriptions", cleanPayload({
            record_id: recordId,
            medicine_id: prescription.medicine_id,
            quantity: prescription.quantity,
            dosage: prescription.dosage,
            usage_instructions: prescription.usage_instructions,
            notes: prescription.notes,
        })),
    ));
};

export const adminResources: AdminResource[] = [
    {
        key: "appointments",
        title: "Appointments",
        path: "/appointments",
        endpoint: "/api/v1/appointments",
        idField: "appointment_id",
        columns: [
            column("appointment_id", "ID"),
            column("pet_name", "Pet"),
            column("service_name", "Service"),
            column("staff_name", "Staff"),
            column("appointment_date", "Date"),
            column("start_time", "Start"),
            column("status", "Status"),
            column("note", "Note"),
        ],
        formFields: [
            { name: "pet_id", label: "Pet", type: "select", required: true },
            { name: "service_id", label: "Service", type: "select", required: true },
            { name: "staff_id", label: "Staff", type: "select" },
            { name: "appointment_date", label: "Date", type: "date", required: true },
            { name: "start_time", label: "Start Time", type: "time", required: true },
            { name: "end_time", label: "End Time", type: "time", required: true },
            { name: "status", label: "Status", type: "select", options: ["pending", "confirmed", "cancelled", "completed"] },
            { name: "note", label: "Note", type: "textarea" },
            { name: "cancellation_reason", label: "Cancellation Reason", type: "textarea" },
            { name: "service_price", label: "Service Price", type: "number" },
        ],
        filterField: "status",
        filterOptions: ["All", "pending", "confirmed", "cancelled", "completed"],
        searchKeys: ["appointment_id", "pet_name", "service_name", "staff_name", "status", "note"],
        extraActionLabel: "Re-Examination",
        loadRows: loadAppointmentsWithNames,
        loadDetails: async (row) => {
            const appointment = await getOne("/api/v1/appointments", row.appointment_id as string | number);
            const records = await detailRowsByField("/api/v1/medical-records", "appointment_id", row.appointment_id);
            const reExaminations = records.length
                ? (await getAll("/api/v1/re-examinations")).filter((exam) =>
                    records.some((record) => String(record.record_id) === String(exam.record_id)),
                )
                : [];
            const formattedReExaminations = enrichReExaminations(reExaminations, records);
            return {
                data: {
                    ...appointment,
                    pet_name: row.pet_name,
                    service_name: row.service_name,
                    staff_name: row.staff_name,
                },
                sections: [{ title: "Re-Examinations", rows: formattedReExaminations }],
            };
        },
        createPayload: cleanPayload,
        updatePayload: cleanPayload,
    },
    {
        key: "medical-records",
        title: "Medical Records",
        path: "/medical-records",
        endpoint: "/api/v1/medical-records",
        idField: "record_id",
        columns: [
            column("record_id", "ID"),
            column("appointment_date", "Appointment Date"),
            column("symptoms", "Symptoms"),
            column("diagnosis", "Diagnosis"),
            column("status", "Status"),
            column("created_at", "Created"),
        ],
        formFields: [
            { name: "appointment_id", label: "Appointment", type: "select", required: true, hideOnEdit: true },
            { name: "symptoms", label: "Symptoms", type: "textarea" },
            { name: "diagnosis", label: "Diagnosis", type: "textarea" },
            { name: "notes", label: "Notes", type: "textarea" },
            { name: "status", label: "Status", type: "select", options: ["in_progress", "completed"] },
            {
                name: "prescriptions",
                label: "Prescriptions",
                type: "repeatable",
                hideOnEdit: true,
                addLabel: "Add Prescription",
                fields: [
                    { name: "medicine_id", label: "Medicine", type: "select", required: true },
                    { name: "quantity", label: "Quantity", type: "number", required: true },
                    { name: "dosage", label: "Dosage" },
                    { name: "usage_instructions", label: "Usage Instructions", type: "textarea" },
                    { name: "notes", label: "Prescription Notes", type: "textarea" },
                ],
            },
        ],
        filterField: "status",
        filterOptions: ["All", "in_progress", "completed"],
        searchKeys: ["record_id", "appointment_date", "symptoms", "diagnosis", "status"],
        loadRows: loadMedicalRecordsWithAppointmentNames,
        loadDetails: async (row) => {
            const record = await getOne("/api/v1/medical-records", row.record_id as string | number);
            const prescriptions = await detailRowsByField("/api/v1/prescriptions", "record_id", row.record_id);
            const formattedPrescriptions = await enrichPrescriptions(prescriptions, record);
            return { data: record, sections: [{ title: "Prescriptions", rows: formattedPrescriptions }] };
        },
        createRecord: createMedicalRecordWithPrescription,
        updatePayload: (values) => cleanPayload({
            symptoms: values.symptoms,
            diagnosis: values.diagnosis,
            notes: values.notes,
            status: values.status,
        }),
    },
    {
        key: "pets-customers",
        title: "Pets and Customers",
        path: "/pets-customers",
        endpoint: "/api/v1/pets",
        idField: "pet_id",
        columns: [
            column("pet_id", "Pet ID"),
            column("name", "Pet Name"),
            column("species", "Species"),
            column("breed", "Breed"),
            column("sex", "Sex"),
            column("owner_full_name", "Owner Full Name"),
        ],
        formFields: [
            { name: "owner_id", label: "Owner", type: "select", required: true },
            { name: "name", label: "Pet Name", required: true },
            { name: "species", label: "Species" },
            { name: "breed", label: "Breed" },
            { name: "sex", label: "Sex", type: "select", options: ["male", "female"] },
            { name: "birth_date", label: "Birth Date", type: "date" },
            { name: "weight", label: "Weight", type: "number" },
            { name: "notes", label: "Notes", type: "textarea" },
        ],
        filterField: "species",
        searchKeys: ["pet_id", "name", "species", "breed", "owner_full_name"],
        loadRows: loadPetsWithOwners,
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        createPayload: cleanPayload,
        updatePayload: cleanPayload,
    },
    {
        key: "medicine",
        title: "Medicine Catalog",
        path: "/catalog/medicine",
        endpoint: "/api/v1/catalog/medicines",
        idField: "medicine_id",
        columns: [
            column("medicine_id", "ID"),
            column("name", "Name"),
            column("unit", "Unit"),
            column("selling_price", "Selling Price"),
            column("ingredients", "Ingredients"),
            column("is_active", "Active"),
        ],
        formFields: [
            { name: "name", label: "Name", required: true },
            { name: "unit", label: "Unit", required: true },
            { name: "selling_price", label: "Selling Price", type: "number", required: true },
            { name: "ingredients", label: "Ingredients", type: "textarea" },
            { name: "is_active", label: "Active", type: "checkbox", defaultValue: true, hideOnCreate: true },
        ],
        filterField: "is_active",
        filterOptions: ["All", "true", "false"],
        searchKeys: ["medicine_id", "name", "unit", "selling_price", "ingredients", "is_active"],
        createPayload: (values) => cleanPayload({ ...values, is_active: true }),
        updatePayload: cleanPayload,
    },
    {
        key: "service",
        title: "Service Catalog",
        path: "/catalog/service",
        endpoint: "/api/v1/catalog/services",
        idField: "service_id",
        columns: [
            column("service_id", "ID"),
            column("name", "Name"),
            column("description", "Description"),
            column("price", "Price"),
            column("is_active", "Active"),
        ],
        formFields: [
            { name: "name", label: "Name", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "price", label: "Price", type: "number", required: true },
            { name: "is_active", label: "Active", type: "checkbox", defaultValue: true, hideOnCreate: true },
        ],
        filterField: "is_active",
        filterOptions: ["All", "true", "false"],
        searchKeys: ["service_id", "name", "description", "price", "is_active"],
        createPayload: (values) => cleanPayload({ ...values, is_active: true }),
        updatePayload: cleanPayload,
    },
    {
        key: "medicine-inventory",
        title: "Medicine Inventory",
        path: "/inventory/medicine",
        endpoint: "/api/v1/medicine-inventory",
        idField: "inventory_id",
        columns: [
            column("inventory_id", "ID"),
            column("medicine_name", "Medicine"),
            column("import_price", "Import Price"),
            column("available_stock", "Available Stock"),
            column("min_threshold", "Min Threshold"),
        ],
        formFields: [
            { name: "medicine_id", label: "Medicine", type: "select", required: true, hideOnEdit: true },
            { name: "import_price", label: "Import Price", type: "number" },
            { name: "available_stock", label: "Available Stock", type: "number" },
            { name: "min_threshold", label: "Min Threshold", type: "number" },
        ],
        searchKeys: ["inventory_id", "medicine_name", "import_price", "available_stock", "min_threshold"],
        loadRows: loadMedicineInventoryWithNames,
        createPayload: cleanPayload,
        updatePayload: cleanPayload,
    },
    {
        key: "suppliers",
        title: "Suppliers",
        path: "/inventory/suppliers",
        endpoint: "/api/v1/suppliers",
        idField: "supplier_id",
        columns: [
            column("supplier_id", "ID"),
            column("name", "Name"),
            column("contact_info", "Contact Info"),
            column("address", "Address"),
        ],
        formFields: [
            { name: "name", label: "Name", required: true },
            { name: "contact_info", label: "Contact Info", type: "textarea" },
            { name: "address", label: "Address", type: "textarea" },
        ],
        searchKeys: ["supplier_id", "name", "contact_info", "address"],
        createPayload: cleanPayload,
        updatePayload: cleanPayload,
    },
    {
        key: "inventory-transactions",
        title: "Inventory Transactions",
        path: "/inventory/transactions",
        endpoint: "/api/v1/inventory-transactions",
        idField: "transaction_id",
        columns: [
            column("transaction_id", "ID"),
            column("medicine_name", "Medicine"),
            column("transaction_type", "Type"),
            column("quantity", "Quantity"),
            column("transaction_date", "Date"),
            column("supplier_name", "Supplier"),
            column("created_by_name", "Created By"),
        ],
        formFields: [
            { name: "medicine_id", label: "Medicine", type: "select", required: true },
            { name: "transaction_type", label: "Transaction Type", type: "select", options: ["import", "export_prescription", "adjustment"], required: true },
            { name: "quantity", label: "Quantity", type: "number", required: true },
            { name: "transaction_date", label: "Transaction Date", type: "date", required: true },
            { name: "supplier_id", label: "Supplier", type: "select" },
            { name: "reference_id", label: "Reference ID", type: "number" },
            { name: "created_by", label: "Created By", type: "select", required: true },
            { name: "notes", label: "Notes", type: "textarea" },
        ],
        searchKeys: ["transaction_id", "medicine_name", "transaction_type", "quantity", "transaction_date", "supplier_name", "created_by_name", "notes"],
        loadRows: loadInventoryTransactionsWithNames,
        createPayload: cleanPayload,
        updatePayload: cleanPayload,
    },
    {
        key: "staff",
        title: "Staff",
        path: "/staff",
        endpoint: "/api/v1/staff",
        idField: "user_id",
        deleteMethod: "patch",
        deletePath: (row) => `/api/v1/staff/${row.user_id}/deactivate`,
        columns: [column("user_id", "User ID"), column("full_name", "Full Name"), column("email", "Email"), column("phone_number", "Phone"), column("role", "Role"), column("position", "Position"), column("status", "Status")],
        formFields: [
            { name: "full_name", label: "Full Name", required: true },
            { name: "email", label: "Email", type: "email", required: true, hideOnEdit: true },
            { name: "phone_number", label: "Phone Number" },
            { name: "password", label: "Password", type: "password", required: true, hideOnEdit: true },
            { name: "role", label: "Role", type: "select", options: ["staff", "admin"], required: true, defaultValue: "staff", hideOnEdit: true },
            { name: "position", label: "Position", required: true },
            { name: "license_number", label: "License Number" },
        ],
        filterField: "role",
        filterOptions: ["All", "staff", "admin"],
        searchKeys: ["user_id", "full_name", "email", "phone_number", "role", "position", "status"],
        createPayload: cleanPayload,
        updatePayload: (values) => cleanPayload({
            full_name: values.full_name,
            position: values.position,
            license_number: values.license_number,
        }),
    },
    {
        key: "account",
        title: "Account",
        path: "/account",
        endpoint: "/api/v1/users",
        idField: "user_id",
        columns: [column("user_id", "ID"), column("full_name", "Full Name"), column("email", "Email"), column("phone_number", "Phone"), column("role", "Role"), column("status", "Account Status")],
        formFields: [],
        filterField: "status",
        filterOptions: ["All", "active", "inactive"],
        searchKeys: ["user_id", "full_name", "email", "phone_number", "role", "status"],
        canDeleteRow: (row) => row.status === "inactive",
    },
];

export const getResourceByKey = (key: string) => adminResources.find((resource) => resource.key === key);
