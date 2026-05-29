import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import DataTable from "../../components/admin/DataTable";
import DetailsPanel from "../../components/admin/DetailsPanel";
import ResourceForm, { FormField } from "../../components/admin/ResourceForm";
import { privateAxios } from "../../utils/axios";
import { AdminRecord, AdminResource, DetailSection } from "./adminResources";
import { hasPermission } from "./permissions";

type AdminResourcePageProps = {
    resource: AdminResource;
};

type ModalState =
    | { type: "create" }
    | { type: "edit"; row: AdminRecord }
    | { type: "reexamination"; row: AdminRecord; initialRecordId?: unknown }
    | { type: "details"; row: AdminRecord; details?: AdminRecord; sections?: DetailSection[] }
    | null;

const matchesSearch = (row: AdminRecord, searchKeys: string[], searchValue: string) => {
    if (!searchValue.trim()) {
        return true;
    }
    const keyword = searchValue.trim().toLowerCase();
    return searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(keyword));
};

const unwrapRows = (response: unknown): AdminRecord[] => {
    const payload = response as { data?: unknown };
    const body = payload.data as { data?: unknown } | unknown[];
    const data = Array.isArray(body) ? body : (body as { data?: unknown })?.data;
    return Array.isArray(data) ? data as AdminRecord[] : [];
};

const labelOf = (row: AdminRecord, keys: string[], fallback: string) => {
    const key = keys.find((itemKey) => row[itemKey] !== undefined && row[itemKey] !== null && row[itemKey] !== "");
    const found = key ? row[key] : undefined;
    if (key?.includes("date") || key?.endsWith("_at")) {
        return formatDate(found);
    }
    return String(found ?? fallback);
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

const referenceConfigs: Record<string, { endpoint: string; idField: string; labelKeys: string[]; filter?: (row: AdminRecord) => boolean; fallback: string }> = {
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

const isDisplayable = (value: unknown) => {
    return value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value);
};

const getVisibleEntries = (data?: AdminRecord | null) => {
    if (!data) {
        return [];
    }

    return Object.entries(data).filter(([, item]) => isDisplayable(item));
};

const AdminResourcePage = ({ resource }: AdminResourcePageProps) => {
    const [rows, setRows] = useState<AdminRecord[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("All");
    const [modal, setModal] = useState<ModalState>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [referenceOptions, setReferenceOptions] = useState<Record<string, Array<{ label: string; value: string | number }>>>({});

    const canCreate = resource.allowCreate !== false && hasPermission(resource.key, "create") && resource.formFields.length > 0;
    const canEdit = resource.allowEdit !== false && hasPermission(resource.key, "edit") && resource.formFields.length > 0;
    const canDelete = resource.allowDelete !== false && hasPermission(resource.key, "delete");

    const loadRows = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            if (resource.loadRows) {
                setRows(await resource.loadRows());
            } else {
                const response = await privateAxios.get(resource.endpoint);
                const payload = response.data?.data ?? response.data;
                setRows(Array.isArray(payload) ? payload : []);
            }
        } catch (requestError) {
            const message = axios.isAxiosError(requestError) ? requestError.response?.data?.message : undefined;
            setError(message ?? `Could not load ${resource.title.toLowerCase()}.`);
            setRows([]);
        } finally {
            setIsLoading(false);
        }
    }, [resource]);

    useEffect(() => {
        loadRows();
    }, [loadRows]);

    useEffect(() => {
        const loadReferenceOptions = async () => {
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
                    const options = rows
                        .filter((row) => config.filter?.(row) ?? true)
                        .map((row) => ({
                            value: row[config.idField] as string | number,
                            label: `${labelOf(row, config.labelKeys, `${config.fallback} #${row[config.idField]}`)} (#${row[config.idField]})`,
                        }));
                    return [fieldName, options] as const;
                }),
            );

            setReferenceOptions(Object.fromEntries(entries.filter(Boolean) as Array<readonly [string, Array<{ label: string; value: string | number }>]>) );
        };

        loadReferenceOptions().catch(() => setReferenceOptions({}));
    }, [resource]);

    const formFields = useMemo<FormField[]>(() => {
        return resource.formFields.map((field) => {
            const options = referenceOptions[field.name];
            return options ? { ...field, type: "select", options } : field;
        });
    }, [referenceOptions, resource.formFields]);

    const filterOptions = useMemo(() => {
        if (resource.filterOptions) {
            return resource.filterOptions;
        }
        if (!resource.filterField) {
            return ["All"];
        }
        const values = new Set(rows.map((row) => String(row[resource.filterField!] ?? "")).filter(Boolean));
        return ["All", ...Array.from(values)];
    }, [resource, rows]);

    const visibleRows = useMemo(() => {
        return rows.filter((row) => {
            const passesFilter =
                filterValue === "All" || !resource.filterField || String(row[resource.filterField] ?? "") === filterValue;
            return passesFilter && matchesSearch(row, resource.searchKeys, searchValue);
        });
    }, [filterValue, resource, rows, searchValue]);

    const handleSubmit = async (values: AdminRecord) => {
        const payload = modal?.type === "edit"
            ? resource.updatePayload?.(values) ?? values
            : resource.createPayload?.(values) ?? values;

        if (modal?.type === "edit") {
            await privateAxios.put(
                `${resource.updateEndpoint ?? resource.endpoint}/${modal.row[resource.idField]}`,
                payload,
            );
        } else {
            await privateAxios.post(resource.createEndpoint ?? resource.endpoint, payload);
        }

        setModal(null);
        await loadRows();
    };

    const handleDetails = async (row: AdminRecord) => {
        setModal({ type: "details", row });
        if (!resource.loadDetails) {
            setModal({ type: "details", row, details: row });
            return;
        }
        const detailResult = await resource.loadDetails(row);
        setModal({ type: "details", row, details: detailResult.data, sections: detailResult.sections });
    };

    const handleDelete = async (row: AdminRecord) => {
        const confirmed = window.confirm(`Delete ${resource.title} record ${row[resource.idField]}?`);
        if (!confirmed) {
            return;
        }
        const deleteUrl = resource.deletePath?.(row) ?? `${resource.deleteEndpoint ?? resource.endpoint}/${row[resource.idField]}`;
        if (resource.deleteMethod === "patch") {
            await privateAxios.patch(deleteUrl);
        } else {
            await privateAxios.delete(deleteUrl);
        }
        await loadRows();
    };

    const handleReExamination = async (row: AdminRecord) => {
        if (resource.key !== "appointments") {
            return;
        }
        try {
            const response = await privateAxios.get("/api/v1/medical-records");
            const records = response.data?.data ?? response.data;
            const record = Array.isArray(records)
                ? records.find((item) => String(item.appointment_id) === String(row.appointment_id))
                : undefined;
            setModal({ type: "reexamination", row, initialRecordId: record?.record_id });
        } catch {
            setModal({ type: "reexamination", row });
        }
    };

    const handleCreateReExamination = async (values: AdminRecord) => {
        await privateAxios.post("/api/v1/re-examinations", {
            record_id: Number(values.record_id),
            suggested_date: values.suggested_date,
            reason: values.reason,
            is_booked: Boolean(values.is_booked),
        });
        setModal(null);
    };

    return (
        <AdminLayout title={resource.title} description="Manage records with searchable, filterable data tables">
            {error && <div className="dashboard-alert">{error}</div>}
            <DataTable
                rows={visibleRows}
                columns={resource.columns}
                getRowId={(row) => String(row[resource.idField])}
                searchValue={searchValue}
                filterValue={filterValue}
                filterOptions={filterOptions}
                canCreate={canCreate}
                canEdit={canEdit}
                canDelete={canDelete}
                canDeleteRow={resource.canDeleteRow}
                isLoading={isLoading}
                extraActionLabel={resource.extraActionLabel}
                onSearchChange={setSearchValue}
                onFilterChange={setFilterValue}
                onAdd={() => setModal({ type: "create" })}
                onEdit={(row) => setModal({ type: "edit", row })}
                onDetails={handleDetails}
                onDelete={handleDelete}
                onExtraAction={handleReExamination}
            />

            {(modal?.type === "create" || modal?.type === "edit") && (
                <AdminModal
                    title={`${modal.type === "edit" ? "Edit" : "Add"} ${resource.title}`}
                    onClose={() => setModal(null)}
                >
                    <ResourceForm
                        fields={formFields}
                        initialValues={modal.type === "edit" ? modal.row : undefined}
                        submitLabel={modal.type === "edit" ? "Save Changes" : "Create"}
                        onSubmit={handleSubmit}
                        onCancel={() => setModal(null)}
                    />
                </AdminModal>
            )}

            {modal?.type === "reexamination" && (
                <AdminModal title="Schedule Re-Examination" onClose={() => setModal(null)}>
                    <ResourceForm
                        fields={[
                            { name: "record_id", label: "Medical Record", type: "select", required: true, options: referenceOptions.record_id },
                            { name: "suggested_date", label: "Suggested Date", type: "date", required: true },
                            { name: "reason", label: "Reason", type: "textarea", required: true },
                            { name: "is_booked", label: "Booked", type: "checkbox" },
                        ]}
                        initialValues={{ record_id: modal.initialRecordId ?? "" }}
                        submitLabel="Schedule"
                        onSubmit={handleCreateReExamination}
                        onCancel={() => setModal(null)}
                    />
                </AdminModal>
            )}

            {modal?.type === "details" && (
                <AdminModal title={`${resource.title} Details`} onClose={() => setModal(null)}>
                    {getVisibleEntries(modal.details ?? modal.row).length > 0 && (
                        <DetailsPanel
                            title={modal.sections?.length ? "Record Information" : undefined}
                            data={modal.details ?? modal.row}
                        />
                    )}
                    {modal.sections?.map((section) => (
                        <div className="details-panel-group" key={section.title}>
                            <h3>{section.title}</h3>
                            {section.rows.length === 0 ? (
                                <p className="empty-text">No records found.</p>
                            ) : (
                                section.rows.map((sectionRow, index) => (
                                    <DetailsPanel
                                        key={String(sectionRow.id ?? sectionRow.prescription_id ?? sectionRow.record_id ?? sectionRow.re_exam_id ?? index)}
                                        title={section.rows.length > 1 ? `#${index + 1}` : undefined}
                                        data={Object.fromEntries(getVisibleEntries(sectionRow))}
                                    />
                                ))
                            )}
                        </div>
                    ))}
                </AdminModal>
            )}
        </AdminLayout>
    );
};

export default AdminResourcePage;
