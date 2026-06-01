import { AdminRecord } from "../../pages/admin/adminResources";
import AdminModal from "./AdminModal";
import ResourceForm, { FormField } from "./ResourceForm";

type AdminResourceFormModalProps = {
    title: string;
    fields: FormField[];
    initialValues?: AdminRecord;
    submitLabel: string;
    onSubmit: (values: AdminRecord) => Promise<void>;
    onClose: () => void;
};

const AdminResourceFormModal = ({
    title,
    fields,
    initialValues,
    submitLabel,
    onSubmit,
    onClose,
}: AdminResourceFormModalProps) => {
    return (
        <AdminModal title={title} onClose={onClose}>
            <ResourceForm
                fields={fields}
                initialValues={initialValues}
                submitLabel={submitLabel}
                onSubmit={onSubmit}
                onCancel={onClose}
            />
        </AdminModal>
    );
};

export default AdminResourceFormModal;
