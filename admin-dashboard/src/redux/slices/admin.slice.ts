import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminRecord, getResourceByKey } from "../../pages/admin/adminResources";
import { privateAxios } from "../../utils/axios";

type ReferenceOption = { label: string; value: string | number };

type ReferenceConfig = {
    endpoint: string;
    idField: string;
    labelKeys: string[];
    filter?: (row: AdminRecord) => boolean;
    fallback: string;
};

type AdminState = {
    resourceKey: string;
    rows: AdminRecord[];
    referenceOptions: Record<string, ReferenceOption[]>;
    isLoading: boolean;
    isReferenceLoading: boolean;
    error: string;
};

const initialState: AdminState = {
    resourceKey: "",
    rows: [],
    referenceOptions: {},
    isLoading: true,
    isReferenceLoading: false,
    error: "",
};

const referenceConfigs: Record<string, ReferenceConfig> = {
    owner_id: {
        endpoint: "/api/v1/users",
        idField: "user_id",
        labelKeys: ["full_name", "email"],
        filter: (row) => row.role === "customer",
        fallback: "Owner",
    },
    pet_id: { endpoint: "/api/v1/pets", idField: "pet_id", labelKeys: ["name"], fallback: "Pet" },
    service_id: { endpoint: "/api/v1/catalog/services", idField: "service_id", labelKeys: ["name"], fallback: "Service" },
    staff_id: {
        endpoint: "/api/v1/staff",
        idField: "user_id",
        labelKeys: ["full_name", "email"],
        fallback: "Staff",
    },
    appointment_id: {
        endpoint: "/api/v1/appointments",
        idField: "appointment_id",
        labelKeys: ["appointment_date", "status"],
        fallback: "Appointment",
    },
    record_id: {
        endpoint: "/api/v1/medical-records",
        idField: "record_id",
        labelKeys: ["diagnosis", "symptoms"],
        fallback: "Medical Record",
    },
    medicine_id: {
        endpoint: "/api/v1/catalog/medicines",
        idField: "medicine_id",
        labelKeys: ["name"],
        fallback: "Medicine",
    },
    supplier_id: {
        endpoint: "/api/v1/suppliers",
        idField: "supplier_id",
        labelKeys: ["name"],
        fallback: "Supplier",
    },
};

const unwrapRows = (response: unknown): AdminRecord[] => {
    const payload = response as { data?: unknown };
    const body = payload.data as { data?: unknown } | unknown[];
    const data = Array.isArray(body) ? body : (body as { data?: unknown })?.data;
    return Array.isArray(data) ? data as AdminRecord[] : [];
};

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

const labelOf = (row: AdminRecord, keys: string[], fallback: string) => {
    const key = keys.find((itemKey) => row[itemKey] !== undefined && row[itemKey] !== null && row[itemKey] !== "");
    const found = key ? row[key] : undefined;
    if (key?.includes("date") || key?.endsWith("_at")) {
        return formatDate(found);
    }
    return String(found ?? fallback);
};

const getResource = (resourceKey: string) => {
    const resource = getResourceByKey(resourceKey);
    if (!resource) {
        throw new Error(`Unknown admin resource: ${resourceKey}`);
    }
    return resource;
};

export const fetchAdminRows = createAsyncThunk<
    { resourceKey: string; rows: AdminRecord[] },
    string,
    { rejectValue: { resourceKey: string; message: string } }
>("admin/fetchAdminRows", async (resourceKey, { rejectWithValue }) => {
    const resource = getResource(resourceKey);

    try {
        if (resource.loadRows) {
            return { resourceKey, rows: await resource.loadRows() };
        }

        const response = await privateAxios.get(resource.endpoint);
        const payload = response.data?.data ?? response.data;
        return { resourceKey, rows: Array.isArray(payload) ? payload : [] };
    } catch (requestError) {
        const message = axios.isAxiosError(requestError) ? requestError.response?.data?.message : undefined;
        return rejectWithValue({ resourceKey, message: message ?? `Could not load ${resource.title.toLowerCase()}.` });
    }
});

export const fetchReferenceOptions = createAsyncThunk<
    { resourceKey: string; referenceOptions: Record<string, ReferenceOption[]> },
    string,
    { rejectValue: string }
>("admin/fetchReferenceOptions", async (resourceKey, { rejectWithValue }) => {
    const resource = getResource(resourceKey);

    try {
        const fields = new Set([
            ...resource.formFields.map((field) => field.name),
            ...(resource.key === "appointments" ? ["record_id"] : []),
        ]);
        const entries = await Promise.all(
            Array.from(fields).map(async (fieldName) => {
                const config = referenceConfigs[fieldName];
                if (!config) {
                    return null;
                }
                const rows = unwrapRows(await privateAxios.get(config.endpoint));
                let optionRows = rows;
                if (resource.key === "medical-records" && fieldName === "appointment_id") {
                    const records = unwrapRows(await privateAxios.get("/api/v1/medical-records"));
                    const usedAppointmentIds = new Set(records.map((record) => String(record.appointment_id)));
                    optionRows = rows.filter((row) => !usedAppointmentIds.has(String(row.appointment_id)));
                }

                const options = optionRows
                    .filter((row) => config.filter?.(row) ?? true)
                    .map((row) => ({
                        value: row[config.idField] as string | number,
                        label: fieldName === "medicine_id"
                            ? labelOf(row, config.labelKeys, `${config.fallback} #${row[config.idField]}`)
                            : `${labelOf(row, config.labelKeys, `${config.fallback} #${row[config.idField]}`)} (#${row[config.idField]})`,
                    }));
                return [fieldName, options] as const;
            }),
        );

        return {
            resourceKey,
            referenceOptions: Object.fromEntries(entries.filter(Boolean) as Array<readonly [string, ReferenceOption[]]>),
        };
    } catch {
        return rejectWithValue("Could not load reference options.");
    }
});

export const saveAdminRecord = createAsyncThunk<
    void,
    { resourceKey: string; values: AdminRecord; editRow?: AdminRecord },
    { rejectValue: string }
>("admin/saveAdminRecord", async ({ resourceKey, values, editRow }, { dispatch, rejectWithValue }) => {
    const resource = getResource(resourceKey);
    const payload = editRow ? resource.updatePayload?.(values) ?? values : resource.createPayload?.(values) ?? values;

    try {
        if (editRow) {
            await privateAxios.put(`${resource.updateEndpoint ?? resource.endpoint}/${editRow[resource.idField]}`, payload);
        } else if (resource.createRecord) {
            await resource.createRecord(values);
        } else {
            await privateAxios.post(resource.createEndpoint ?? resource.endpoint, payload);
        }
        await dispatch(fetchAdminRows(resourceKey)).unwrap();
        dispatch(fetchReferenceOptions(resourceKey));
    } catch (error) {
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return rejectWithValue(message ?? `Could not save ${resource.title.toLowerCase()}.`);
    }
});

export const deleteAdminRecord = createAsyncThunk<
    void,
    { resourceKey: string; row: AdminRecord },
    { rejectValue: string }
>("admin/deleteAdminRecord", async ({ resourceKey, row }, { dispatch, rejectWithValue }) => {
    const resource = getResource(resourceKey);
    const deleteUrl = resource.deletePath?.(row) ?? `${resource.deleteEndpoint ?? resource.endpoint}/${row[resource.idField]}`;

    try {
        if (resource.deleteMethod === "patch") {
            await privateAxios.patch(deleteUrl);
        } else {
            await privateAxios.delete(deleteUrl);
        }
        await dispatch(fetchAdminRows(resourceKey)).unwrap();
    } catch (error) {
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return rejectWithValue(message ?? `Could not delete ${resource.title.toLowerCase()}.`);
    }
});

export const fetchAdminDetails = createAsyncThunk(
    "admin/fetchAdminDetails",
    async ({ resourceKey, row }: { resourceKey: string; row: AdminRecord }) => {
        const resource = getResource(resourceKey);
        if (!resource.loadDetails) {
            return { data: row };
        }
        return resource.loadDetails(row);
    },
);

export const fetchInitialReExaminationRecord = createAsyncThunk(
    "admin/fetchInitialReExaminationRecord",
    async (row: AdminRecord) => {
        const response = await privateAxios.get("/api/v1/medical-records");
        const records = response.data?.data ?? response.data;
        const record = Array.isArray(records)
            ? records.find((item) => String(item.appointment_id) === String(row.appointment_id))
            : undefined;
        return record?.record_id;
    },
);

export const createReExamination = createAsyncThunk<
    void,
    AdminRecord,
    { rejectValue: string }
>("admin/createReExamination", async (values, { rejectWithValue }) => {
    try {
        await privateAxios.post("/api/v1/re-examinations", {
            record_id: Number(values.record_id),
            suggested_date: values.suggested_date,
            reason: values.reason,
            is_booked: Boolean(values.is_booked),
        });
    } catch (error) {
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return rejectWithValue(message ?? "Could not schedule re-examination.");
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdminResourceKey: (state, action: PayloadAction<string>) => {
            if (state.resourceKey !== action.payload) {
                state.resourceKey = action.payload;
                state.rows = [];
                state.referenceOptions = {};
                state.error = "";
                state.isLoading = true;
            }
        },
        clearAdminError: (state) => {
            state.error = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminRows.pending, (state, action) => {
                state.resourceKey = action.meta.arg;
                state.isLoading = true;
                state.error = "";
            })
            .addCase(fetchAdminRows.fulfilled, (state, action) => {
                state.resourceKey = action.payload.resourceKey;
                state.rows = action.payload.rows;
                state.isLoading = false;
            })
            .addCase(fetchAdminRows.rejected, (state, action) => {
                state.resourceKey = action.payload?.resourceKey ?? action.meta.arg;
                state.rows = [];
                state.isLoading = false;
                state.error = action.payload?.message ?? "Could not load records.";
            })
            .addCase(fetchReferenceOptions.pending, (state) => {
                state.isReferenceLoading = true;
            })
            .addCase(fetchReferenceOptions.fulfilled, (state, action) => {
                if (state.resourceKey === action.payload.resourceKey) {
                    state.referenceOptions = action.payload.referenceOptions;
                }
                state.isReferenceLoading = false;
            })
            .addCase(fetchReferenceOptions.rejected, (state) => {
                state.referenceOptions = {};
                state.isReferenceLoading = false;
            })
            .addCase(saveAdminRecord.rejected, (state, action) => {
                state.error = action.payload ?? "Could not save record.";
            })
            .addCase(deleteAdminRecord.rejected, (state, action) => {
                state.error = action.payload ?? "Could not delete record.";
            })
            .addCase(createReExamination.rejected, (state, action) => {
                state.error = action.payload ?? "Could not schedule re-examination.";
            });
    },
});

export const { setAdminResourceKey, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
