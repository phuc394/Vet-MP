import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import { ReactNode } from "react";

export type TableColumn<T> = {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
    rows: T[];
    columns: TableColumn<T>[];
    getRowId: (row: T) => string | number;
    searchValue: string;
    filterValue: string;
    filterOptions: string[];
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canEditRow?: (row: T) => boolean;
    canDeleteRow?: (row: T) => boolean;
    isLoading?: boolean;
    extraActionLabel?: string;
    onSearchChange: (value: string) => void;
    onFilterChange: (value: string) => void;
    onAdd: () => void;
    onEdit: (row: T) => void;
    onDetails: (row: T) => void;
    onDelete: (row: T) => void;
    onExtraAction?: (row: T) => void;
};

const DataTable = <T,>({
    rows,
    columns,
    getRowId,
    searchValue,
    filterValue,
    filterOptions,
    canCreate,
    canEdit,
    canDelete,
    canEditRow,
    canDeleteRow,
    isLoading = false,
    extraActionLabel,
    onSearchChange,
    onFilterChange,
    onAdd,
    onEdit,
    onDetails,
    onDelete,
    onExtraAction,
}: DataTableProps<T>) => {
    return (
        <section className="admin-table-panel">
            <div className="table-toolbar">
                <div className="table-toolbar-left">
                    {canCreate && (
                        <button className="admin-add-button" type="button" onClick={onAdd}>
                            <AddIcon fontSize="small" />
                            <span>Add</span>
                        </button>
                    )}
                </div>
                <div className="table-toolbar-right">
                    <label className="admin-search">
                        <SearchIcon fontSize="small" />
                        <input
                            type="search"
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Search"
                        />
                    </label>
                    <select
                        className="admin-filter"
                        value={filterValue}
                        onChange={(event) => onFilterChange(event.target.value)}
                        aria-label="Filter table"
                    >
                        {filterOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-table-scroll">
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>{column.header}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length + 1}>Loading data...</td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1}>No records found.</td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={getRowId(row)}>
                                    {columns.map((column) => (
                                        <td key={column.key}>{column.render(row)}</td>
                                    ))}
                                    <td>
                                        <div className="admin-actions">
                                            {canEdit && (canEditRow?.(row) ?? true) && (
                                                <button type="button" onClick={() => onEdit(row)}>
                                                    <EditIcon fontSize="small" />
                                                    <span>Edit</span>
                                                </button>
                                            )}
                                            <button type="button" onClick={() => onDetails(row)}>
                                                <InfoOutlinedIcon fontSize="small" />
                                                <span>Details</span>
                                            </button>
                                            {canDelete && (canDeleteRow?.(row) ?? true) && (
                                                <button className="danger" type="button" onClick={() => onDelete(row)}>
                                                    <DeleteIcon fontSize="small" />
                                                    <span>Delete</span>
                                                </button>
                                            )}
                                            {extraActionLabel && onExtraAction && (
                                                <button type="button" onClick={() => onExtraAction(row)}>
                                                    <ReplayIcon fontSize="small" />
                                                    <span>{extraActionLabel}</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default DataTable;
