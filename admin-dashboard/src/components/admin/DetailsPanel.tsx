import { ReactNode } from "react";

type DetailsPanelProps = {
    title?: string;
    data?: Record<string, unknown> | null;
    children?: ReactNode;
};

const formatDate = (value: unknown) => {
    if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const shouldFormatAsDate = (key: string, value: unknown) => {
    if (!key.includes("date") && !key.endsWith("_at")) {
        return false;
    }

    return typeof value === "string" || typeof value === "number" || value instanceof Date;
};

const formatValue = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }
    if (shouldFormatAsDate(key, value)) {
        return formatDate(value) ?? String(value);
    }
    return String(value);
};

const isDisplayable = (value: unknown) => {
    return value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value);
};

const DetailsPanel = ({ title, data, children }: DetailsPanelProps) => {
    return (
        <div className="details-panel">
            {title && <h3>{title}</h3>}
            {data && (
                <dl>
                    {Object.entries(data).filter(([, value]) => isDisplayable(value)).map(([key, value]) => (
                        <div key={key}>
                            <dt>{key.replaceAll("_", " ")}</dt>
                            <dd>{formatValue(key, value)}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {children}
        </div>
    );
};

export default DetailsPanel;
