import { SyntheticEvent, useMemo, useState } from "react";

export type FormField = {
    name: string;
    label: string;
    type?: "text" | "number" | "date" | "time" | "email" | "password" | "select" | "textarea" | "checkbox";
    options?: Array<string | { label: string; value: string | number }>;
    required?: boolean;
};

type ResourceFormProps = {
    fields: FormField[];
    initialValues?: Record<string, unknown>;
    submitLabel: string;
    onSubmit: (values: Record<string, unknown>) => Promise<void>;
    onCancel: () => void;
};

const formatInitialValue = (value: unknown) => {
    if (typeof value === "boolean") {
        return value;
    }
    if (value === null || value === undefined) {
        return "";
    }
    return String(value).slice(0, 16);
};

const ResourceForm = ({ fields, initialValues = {}, submitLabel, onSubmit, onCancel }: ResourceFormProps) => {
    const defaultValues = useMemo(() => {
        return fields.reduce<Record<string, unknown>>((values, field) => {
            values[field.name] = formatInitialValue(initialValues[field.name]);
            return values;
        }, {});
    }, [fields, initialValues]);

    const [values, setValues] = useState(defaultValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                return (
                    <label key={field.name}>
                        <span>{field.label}</span>
                        {field.type === "textarea" ? (
                            <textarea
                                required={field.required}
                                value={String(value ?? "")}
                                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                            />
                        ) : field.type === "select" ? (
                            <select
                                required={field.required}
                                value={String(value ?? "")}
                                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
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
                        ) : field.type === "checkbox" ? (
                            <input
                                type="checkbox"
                                checked={Boolean(value)}
                                onChange={(event) => setValues({ ...values, [field.name]: event.target.checked })}
                            />
                        ) : (
                            <input
                                required={field.required}
                                type={field.type ?? "text"}
                                value={String(value ?? "")}
                                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                            />
                        )}
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
