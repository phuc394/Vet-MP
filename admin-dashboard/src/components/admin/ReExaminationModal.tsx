import { AdminRecord } from "../../pages/admin/adminResources";
import AdminModal from "./AdminModal";
import ResourceForm, { FormField } from "./ResourceForm";

type ReExaminationModalProps = {
    initialRecordId?: unknown;
    recordOptions?: FormField["options"];
    onSubmit: (values: AdminRecord) => Promise<void>;
    onClose: () => void;
};

const ReExaminationModal = ({ initialRecordId, recordOptions, onSubmit, onClose }: ReExaminationModalProps) => {
    return (
        <AdminModal title="Schedule Re-Examination" onClose={onClose}>
            <ResourceForm
                fields={[
                    { name: "record_id", label: "Medical Record", type: "select", required: true, options: recordOptions },
                    { name: "suggested_date", label: "Suggested Date", type: "date", required: true },
                    { name: "reason", label: "Reason", type: "textarea", required: true },
                    { name: "is_booked", label: "Booked", type: "checkbox" },
                ]}
                initialValues={{ record_id: initialRecordId ?? "" }}
                submitLabel="Schedule"
                onSubmit={onSubmit}
                onCancel={onClose}
            />
        </AdminModal>
    );
};

export default ReExaminationModal;
