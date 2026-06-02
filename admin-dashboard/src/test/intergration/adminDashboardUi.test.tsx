import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosHeaders, AxiosResponse } from "axios";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DataTable, { TableColumn } from "../../components/admin/DataTable";
import Login from "../../pages/login/Login";
import loginReducer from "../../redux/slices/login.slice";
import { AuthService } from "../../utils/axios";

vi.mock("../../utils/axios", () => ({
    AuthService: {
        login: vi.fn(),
    },
}));

type ServiceRow = {
    service_id: number;
    name: string;
    price: number;
};

const createAxiosResponse = <T,>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
        headers: new AxiosHeaders(),
    },
});

const renderLogin = () => {
    const store = configureStore({
        reducer: {
            login: loginReducer,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </Provider>,
    );

    return store;
};

describe("admin dashboard UI integration", () => {
    beforeEach(() => {
        vi.mocked(AuthService.login).mockReset();
    });

    it("renders the login page in English and submits the standard admin email", async () => {
        vi.mocked(AuthService.login).mockResolvedValue(createAxiosResponse({
            data: {
                accessToken: "admin-token",
            },
        }));

        renderLogin();

        expect(screen.getByRole("heading", { name: "Sign In" })).toBeTruthy();
        expect(screen.getByLabelText("Email")).toBeTruthy();
        expect(screen.getByLabelText("Password")).toBeTruthy();
        expect(screen.getByPlaceholderText("admin@gmail.com")).toBeTruthy();

        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@gmail.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
        fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

        await waitFor(() => {
            expect(AuthService.login).toHaveBeenCalledWith({
                identifier: "admin@gmail.com",
                password: "secret",
            });
        });
    });

    it("shows a Redux-backed login error from a failed submit", async () => {
        vi.mocked(AuthService.login).mockRejectedValue({
            response: {
                data: {
                    message: "Invalid email or password.",
                },
            },
        });

        renderLogin();

        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@gmail.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
        fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

        expect(await screen.findByText("Invalid email or password.")).toBeTruthy();
    });

    it("renders an admin data table and wires toolbar/action callbacks", () => {
        const rows: ServiceRow[] = [
            { service_id: 1, name: "Vaccination", price: 500000 },
            { service_id: 2, name: "Grooming", price: 300000 },
        ];
        const columns: TableColumn<ServiceRow>[] = [
            { key: "service_id", header: "ID", render: (row) => row.service_id },
            { key: "name", header: "Name", render: (row) => row.name },
            { key: "price", header: "Price", render: (row) => row.price },
        ];
        const onAdd = vi.fn();
        const onEdit = vi.fn();
        const onDetails = vi.fn();
        const onDelete = vi.fn();
        const onSearchChange = vi.fn();
        const onFilterChange = vi.fn();

        render(
            <DataTable
                rows={rows}
                columns={columns}
                getRowId={(row) => row.service_id}
                searchValue=""
                filterValue="All"
                filterOptions={["All", "active"]}
                canCreate
                canEdit
                canDelete
                onSearchChange={onSearchChange}
                onFilterChange={onFilterChange}
                onAdd={onAdd}
                onEdit={onEdit}
                onDetails={onDetails}
                onDelete={onDelete}
            />,
        );

        expect(screen.getByText("Vaccination")).toBeTruthy();
        expect(screen.getByText("Grooming")).toBeTruthy();

        fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "vacc" } });
        fireEvent.change(screen.getByLabelText("Filter table"), { target: { value: "active" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
        fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Details" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

        expect(onSearchChange).toHaveBeenCalledWith("vacc");
        expect(onFilterChange).toHaveBeenCalledWith("active");
        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledWith(rows[0]);
        expect(onDetails).toHaveBeenCalledWith(rows[0]);
        expect(onDelete).toHaveBeenCalledWith(rows[0]);
    });
});
