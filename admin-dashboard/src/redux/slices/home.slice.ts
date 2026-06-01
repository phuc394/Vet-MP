import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChartDatum, RevenueItem, RevenueSummary, TableResponse } from "../../pages/home/components/dashboardTypes";
import { toChartData } from "../../pages/home/components/dashboardUtils";
import { ReportService } from "../../utils/axios";

type HomeState = {
    revenueSummary: RevenueSummary | null;
    revenueTrend: ChartDatum[];
    topServices: ChartDatum[];
    revenueItems: RevenueItem[];
    medicineStock: ChartDatum[];
    lowStock: TableResponse | null;
    cancelledAppointments: TableResponse | null;
    userRoles: ChartDatum[];
    petSpecies: ChartDatum[];
    appointmentStatus: ChartDatum[];
    isLoading: boolean;
    error: string;
    isMenuOpen: boolean;
    isDarkMode: boolean;
    adminEmail: string;
};

const initialState: HomeState = {
    revenueSummary: null,
    revenueTrend: [],
    topServices: [],
    revenueItems: [],
    medicineStock: [],
    lowStock: null,
    cancelledAppointments: null,
    userRoles: [],
    petSpecies: [],
    appointmentStatus: [],
    isLoading: true,
    error: "",
    isMenuOpen: false,
    isDarkMode: localStorage.getItem("darkMode") === "true",
    adminEmail: localStorage.getItem("adminEmail") ?? "admin@gmail.com",
};

export const fetchDashboardReports = createAsyncThunk<
    Omit<HomeState, "isLoading" | "error" | "isMenuOpen" | "isDarkMode" | "adminEmail">,
    void,
    { rejectValue: string }
>("home/fetchDashboardReports", async (_, { rejectWithValue }) => {
    try {
        const [
            revenueSummaryResponse,
            revenueItemsResponse,
            revenueTrendResponse,
            topServicesResponse,
            medicineStockResponse,
            lowStockResponse,
            cancelledAppointmentsResponse,
            userRolesResponse,
            petSpeciesResponse,
            appointmentStatusResponse,
        ] = await Promise.all([
            ReportService.getRevenueSummary(),
            ReportService.getRevenueItems(),
            ReportService.getRevenueTrend(),
            ReportService.getTopRevenueServices(),
            ReportService.getMedicineStock(),
            ReportService.getLowStockMedicines(),
            ReportService.getCancelledAppointments(),
            ReportService.getUserRoleDistribution(),
            ReportService.getPetSpeciesDistribution(),
            ReportService.getAppointmentStatusDistribution(),
        ]);

        return {
            revenueSummary: revenueSummaryResponse.data.data,
            revenueItems: revenueItemsResponse.data.data,
            revenueTrend: toChartData(revenueTrendResponse.data.data),
            topServices: toChartData(topServicesResponse.data.data),
            medicineStock: toChartData(medicineStockResponse.data.data),
            lowStock: lowStockResponse.data.data,
            cancelledAppointments: cancelledAppointmentsResponse.data.data,
            userRoles: toChartData(userRolesResponse.data.data),
            petSpecies: toChartData(petSpeciesResponse.data.data),
            appointmentStatus: toChartData(appointmentStatusResponse.data.data),
        };
    } catch {
        return rejectWithValue("Could not load report data. Please check the admin token, API Gateway, and ReportService.");
    }
});

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        openMenu: (state) => {
            state.isMenuOpen = true;
        },
        closeMenu: (state) => {
            state.isMenuOpen = false;
        },
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem("darkMode", String(state.isDarkMode));
        },
        logoutAdmin: (state) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("adminEmail");
            state.adminEmail = "admin@gmail.com";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardReports.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(fetchDashboardReports.fulfilled, (state, action) => {
                state.isLoading = false;
                Object.assign(state, action.payload);
            })
            .addCase(fetchDashboardReports.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Could not load report data.";
            });
    },
});

export const { openMenu, closeMenu, toggleDarkMode, logoutAdmin } = homeSlice.actions;
export default homeSlice.reducer;
