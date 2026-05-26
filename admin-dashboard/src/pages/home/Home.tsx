import "./Home.css";
import { useEffect, useMemo, useState } from "react";
import { ReportService } from "../../utils/axios";
import DashboardHeader from "./components/DashboardHeader";
import InventorySection from "./components/InventorySection";
import MetricGrid from "./components/MetricGrid";
import RevenueSection from "./components/RevenueSection";
import UserSection from "./components/UserSection";
import {
    ChartDatum,
    RevenueItem,
    RevenueSummary,
    TableResponse,
} from "./components/dashboardTypes";
import { toChartData } from "./components/dashboardUtils";

const Home = () => {
    const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null);
    const [revenueTrend, setRevenueTrend] = useState<ChartDatum[]>([]);
    const [topServices, setTopServices] = useState<ChartDatum[]>([]);
    const [revenueItems, setRevenueItems] = useState<RevenueItem[]>([]);
    const [medicineStock, setMedicineStock] = useState<ChartDatum[]>([]);
    const [lowStock, setLowStock] = useState<TableResponse | null>(null);
    const [cancelledAppointments, setCancelledAppointments] = useState<TableResponse | null>(null);
    const [userRoles, setUserRoles] = useState<ChartDatum[]>([]);
    const [petSpecies, setPetSpecies] = useState<ChartDatum[]>([]);
    const [appointmentStatus, setAppointmentStatus] = useState<ChartDatum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReports = async () => {
            setIsLoading(true);
            setError("");

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

                setRevenueSummary(revenueSummaryResponse.data.data);
                setRevenueItems(revenueItemsResponse.data.data);
                setRevenueTrend(toChartData(revenueTrendResponse.data.data));
                setTopServices(toChartData(topServicesResponse.data.data));
                setMedicineStock(toChartData(medicineStockResponse.data.data));
                setLowStock(lowStockResponse.data.data);
                setCancelledAppointments(cancelledAppointmentsResponse.data.data);
                setUserRoles(toChartData(userRolesResponse.data.data));
                setPetSpecies(toChartData(petSpeciesResponse.data.data));
                setAppointmentStatus(toChartData(appointmentStatusResponse.data.data));
            } catch {
                setError("Không thể tải dữ liệu báo cáo. Vui lòng kiểm tra token admin, API Gateway và ReportService.");
            } finally {
                setIsLoading(false);
            }
        };

        loadReports();
    }, []);

    const totalUsers = useMemo(() => {
        return userRoles.reduce((sum, item) => sum + item.value, 0);
    }, [userRoles]);

    const staffCount = useMemo(() => {
        return userRoles
            .filter((item) => ["admin", "staff"].includes(item.name.toLowerCase()))
            .reduce((sum, item) => sum + item.value, 0);
    }, [userRoles]);

    const customerCount = useMemo(() => {
        return userRoles.find((item) => item.name.toLowerCase() === "customer")?.value ?? 0;
    }, [userRoles]);

    const cancelledCount = cancelledAppointments?.rows.length ?? 0;

    return (
        <div className="dashboard">
            <DashboardHeader />

            {error && <div className="dashboard-alert">{error}</div>}

            {isLoading ? (
                <div className="dashboard-loading">Đang tải dữ liệu...</div>
            ) : (
                <>
                    <MetricGrid revenueSummary={revenueSummary} cancelledCount={cancelledCount} />
                    <RevenueSection
                        revenueTrend={revenueTrend}
                        topServices={topServices}
                        revenueItems={revenueItems}
                        cancelledAppointments={cancelledAppointments}
                    />
                    <InventorySection medicineStock={medicineStock} lowStock={lowStock} />
                    <UserSection
                        userRoles={userRoles}
                        petSpecies={petSpecies}
                        appointmentStatus={appointmentStatus}
                        totalUsers={totalUsers}
                        staffCount={staffCount}
                        customerCount={customerCount}
                    />
                </>
            )}
        </div>
    );
};

export default Home;
