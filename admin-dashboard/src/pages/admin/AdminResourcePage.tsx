import { useEffect, useMemo, useState } from "react";
import "../../styles/global.css";
import "./admin.css";
import AdminResourceDetailsModal from "../../components/admin/AdminResourceDetailsModal";
import AdminResourceFormModal from "../../components/admin/AdminResourceFormModal";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import { FormField } from "../../components/admin/ResourceForm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    deleteAdminRecord,
    fetchAdminDetails,
    fetchAdminRows,
    fetchReferenceOptions,
    saveAdminRecord,
    setAdminResourceKey,
} from "../../redux/slices/admin.slice";
import { AdminRecord, AdminResource, DetailSection } from "./adminResources";
import { getCurrentRole, hasPermission } from "./permissions";

type AdminResourcePageProps = {
    resource: AdminResource;
};

type ModalState =
    | { type: "create" }
    | { type: "edit"; row: AdminRecord }
    | { type: "details"; row: AdminRecord; details: AdminRecord; sections?: DetailSection[] }
    | null;

const matchesSearch = (row: AdminRecord, searchKeys: string[], searchValue: string) => {
    if (!searchValue.trim()) {
        return true;
    }
    const keyword = searchValue.trim().toLowerCase();
    return searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(keyword));
};

const AdminResourcePage = ({ resource }: AdminResourcePageProps) => {
    const dispatch = useAppDispatch();
    const { rows, referenceOptions, isLoading, error } = useAppSelector((state) => state.admin);
    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("All");
    const [modal, setModal] = useState<ModalState>(null);

    const canCreate = resource.allowCreate !== false && hasPermission(resource.key, "create") && resource.formFields.length > 0;
    const canEdit = resource.allowEdit !== false && hasPermission(resource.key, "edit") && resource.formFields.length > 0;
    const canDelete = resource.allowDelete !== false && hasPermission(resource.key, "delete");

    useEffect(() => {
        dispatch(setAdminResourceKey(resource.key));
        dispatch(fetchAdminRows(resource.key));
        dispatch(fetchReferenceOptions(resource.key));
    }, [dispatch, resource.key]);

    useEffect(() => {
        setFilterValue("All");
        setSearchValue("");
        setModal(null);
    }, [resource.key]);

    const formFields = useMemo<FormField[]>(() => {
        const isEdit = modal?.type === "edit";
        const role = getCurrentRole();
        return resource.formFields.filter((field) => {
            if (isEdit && field.hideOnEdit) {
                return false;
            }
            if (!isEdit && field.hideOnCreate) {
                return false;
            }
            if (role === "staff" && resource.key === "appointments" && ["pet_id", "service_id", "staff_id", "service_price"].includes(field.name)) {
                return false;
            }
            return true;
        }).map((field) => {
            const options = referenceOptions[field.name];
            const fieldWithChildOptions = field.fields
                ? {
                    ...field,
                    fields: field.fields.map((childField) => {
                        const childOptions = referenceOptions[childField.name];
                        return childOptions ? { ...childField, type: "select" as const, options: childOptions } : childField;
                    }),
                }
                : field;
            return options ? { ...fieldWithChildOptions, type: "select", options } : fieldWithChildOptions;
        });
    }, [modal?.type, referenceOptions, resource.formFields, resource.key]);

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
        await dispatch(saveAdminRecord({
            resourceKey: resource.key,
            values,
            editRow: modal?.type === "edit" ? modal.row : undefined,
        })).unwrap();
        setModal(null);
    };

    const handleDetails = async (row: AdminRecord) => {
        try {
            const detailResult = await dispatch(fetchAdminDetails({ resourceKey: resource.key, row })).unwrap();
            setModal({ type: "details", row, details: detailResult.data, sections: detailResult.sections });
        } catch {
            setModal({ type: "details", row, details: row });
        }
    };

    const handleDelete = async (row: AdminRecord) => {
        const confirmed = window.confirm(`Delete ${resource.title} record ${row[resource.idField]}?`);
        if (!confirmed) {
            return;
        }
        await dispatch(deleteAdminRecord({ resourceKey: resource.key, row })).unwrap();
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
                onSearchChange={setSearchValue}
                onFilterChange={setFilterValue}
                onAdd={() => setModal({ type: "create" })}
                onEdit={(row) => setModal({ type: "edit", row })}
                onDetails={handleDetails}
                onDelete={handleDelete}
            />

            {(modal?.type === "create" || modal?.type === "edit") && (
                <AdminResourceFormModal
                    title={`${modal.type === "edit" ? "Edit" : "Add"} ${resource.title}`}
                    fields={formFields}
                    initialValues={modal.type === "edit" ? modal.row : undefined}
                    submitLabel={modal.type === "edit" ? "Save Changes" : "Create"}
                    onSubmit={handleSubmit}
                    onClose={() => setModal(null)}
                />
            )}

            {modal?.type === "details" && (
                <AdminResourceDetailsModal
                    title={`${resource.title} Details`}
                    row={modal.row}
                    details={modal.details}
                    sections={modal.sections}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
};

export default AdminResourcePage;
