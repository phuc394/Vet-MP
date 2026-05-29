import { ReactNode } from "react";

type AdminModalProps = {
    title: string;
    children: ReactNode;
    onClose: () => void;
};

const AdminModal = ({ title, children, onClose }: AdminModalProps) => {
    return (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
            <section
                className="admin-modal"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="admin-modal-header">
                    <h2>{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Close dialog">
                        x
                    </button>
                </header>
                {children}
            </section>
        </div>
    );
};

export default AdminModal;
