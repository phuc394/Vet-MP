import { AdminRecord, DetailSection } from "../../pages/admin/adminResources";
import AdminModal from "./AdminModal";
import DetailsPanel from "./DetailsPanel";

type AdminResourceDetailsModalProps = {
    title: string;
    row: AdminRecord;
    details?: AdminRecord;
    sections?: DetailSection[];
    onClose: () => void;
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

const AdminResourceDetailsModal = ({ title, row, details, sections, onClose }: AdminResourceDetailsModalProps) => {
    const detailData = details ?? row;

    return (
        <AdminModal title={title} onClose={onClose}>
            {getVisibleEntries(detailData).length > 0 && (
                <DetailsPanel title={sections?.length ? "Record Information" : undefined} data={detailData} />
            )}
            {sections?.map((section) => (
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
    );
};

export default AdminResourceDetailsModal;
