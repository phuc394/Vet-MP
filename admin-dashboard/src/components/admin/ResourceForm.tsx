import { SyntheticEvent, useMemo, useState } from "react";

export type FormField = {
    name: string;
    label: string;
    type?: "text" | "number" | "date" | "time" | "email" | "password" | "select" | "textarea" | "checkbox" | "repeatable";
    options?: Array<string | { label: string; value: string | number }>;
    required?: boolean;
    defaultValue?: unknown;
    hideOnCreate?: boolean;
    hideOnEdit?: boolean;
    fields?: FormField[];
    addLabel?: string;
};

type ResourceFormProps = {
    fields: FormField[];
    initialValues?: Record<string, unknown>;
    submitLabel: string;
    onSubmit: (values: Record<string, unknown>) => Promise<void>;
    onCancel: () => void;
};

const formatDateInputValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const raw = String(value);
    const dateMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        return dateMatch[1];
    }

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatTimeInputValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const raw = String(value);
    const timeMatch = raw.match(/(?:T|\s)?(\d{2}:\d{2})/);
    return timeMatch ? timeMatch[1] : "";
};

const formatCheckboxInputValue = (value: unknown) => {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "number") {
        return value === 1;
    }
    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1";
    }
    return false;
};

const formatInitialValue = (value: unknown, type?: FormField["type"]) => {
    if (type === "repeatable") {
        return Array.isArray(value) && value.length > 0 ? value : [{}];
    }

    if (type === "checkbox") {
        return formatCheckboxInputValue(value);
    }

    if (typeof value === "boolean") {
        return value;
    }
    if (value === null || value === undefined) {
        return "";
    }

    if (type === "date") {
        return formatDateInputValue(value);
    }

    if (type === "time") {
        return formatTimeInputValue(value);
    }

    return String(value).slice(0, 16);
};

const ResourceForm = ({ fields, initialValues = {}, submitLabel, onSubmit, onCancel }: ResourceFormProps) => {
    const defaultValues = useMemo(() => {
        return fields.reduce<Record<string, unknown>>((values, field) => {
            values[field.name] = formatInitialValue(initialValues[field.name] ?? field.defaultValue, field.type);
            return values;
        }, {});
    }, [fields, initialValues]);

    const [values, setValues] = useState(defaultValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const renderControl = (
        field: FormField,
        value: unknown,
        onChange: (value: unknown) => void,
    ) => {
        if (field.type === "textarea") {
            return (
                <textarea
                    required={field.required}
                    value={String(value ?? "")}
                    onChange={(event) => onChange(event.target.value)}
                />
            );
        }

        if (field.type === "select") {
            return (
                <select
                    required={field.required}
                    value={String(value ?? "")}
                    onChange={(event) => onChange(event.target.value)}
                >
                    <option value="">Select</option>
                    {field.options?.map((option) => {
                        const optionValue = typeof option === "string" ? option : option.value;
                        const optionLabel = typeof option === "string" ? option : option.label;

                        return (
                            <option key={String(optionValue)} value={optionValue}>
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>
            );
        }

        if (field.type === "checkbox") {
            return (
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => onChange(event.target.checked)}
                />
            );
        }

        return (
            <input
                required={field.required}
                type={field.type ?? "text"}
                value={String(value ?? "")}
                onChange={(event) => onChange(event.target.value)}
            />
        );
    };

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="resource-form" onSubmit={handleSubmit}>
            {fields.map((field) => {
                const value = values[field.name];
                if (field.type === "repeatable") {
                    const items = Array.isArray(value) ? value as Record<string, unknown>[] : [{}];
                    const childFields = field.fields ?? [];

                    return (
                        <div className="resource-repeatable" key={field.name}>
                            <div className="resource-repeatable-header">
                                <span>{field.label}</span>
                                <button
                                    type="button"
                                    onClick={() => setValues({ ...values, [field.name]: [...items, {}] })}
                                >
                                    {field.addLabel ?? "Add item"}
                                </button>
                            </div>
                            {items.map((item, index) => (
                                <div className="resource-repeatable-item" key={`${field.name}-${index}`}>
                                    {childFields.map((childField) => (
                                        <label key={childField.name}>
                                            <span>{childField.label}</span>
                                            {renderControl(
                                                childField,
                                                item[childField.name],
                                                (childValue) => {
                                                    const nextItems = items.map((current, itemIndex) =>
                                                        itemIndex === index
                                                            ? { ...current, [childField.name]: childValue }
                                                            : current,
                                                    );
                                                    setValues({ ...values, [field.name]: nextItems });
                                                },
                                            )}
                                        </label>
                                    ))}
                                    {items.length > 1 && (
                                        <button
                                            className="danger"
                                            type="button"
                                            onClick={() => setValues({
                                                ...values,
                                                [field.name]: items.filter((_, itemIndex) => itemIndex !== index),
                                            })}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                }

                return (
                    <label key={field.name}>
                        <span>{field.label}</span>
                        {renderControl(field, value, (nextValue) => setValues({ ...values, [field.name]: nextValue }))}
                    </label>
                );
            })}
            <div className="resource-form-actions">
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
                <button className="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default ResourceForm;
