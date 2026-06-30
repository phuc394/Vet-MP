import "./Home.css";
import "../../styles/global.css";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import HamburgerMenu from "../../components/HamburgerMenu";
import HamburgerMenuToggle from "../../components/HamburgerMenuToggle";
import Header from "../../components/Header";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { closeMenu, fetchDashboardReports, logoutAdmin, openMenu, toggleDarkMode } from "../../redux/slices/home.slice";
import InventorySection from "./components/InventorySection";
import MetricGrid from "./components/MetricGrid";
import RevenueSection from "./components/RevenueSection";
import UserSection from "./components/UserSection";
import { getCurrentRole } from "../admin/permissions";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        revenueSummary,
        revenueTrend,
        topServices,
        revenueItems,
        medicineStock,
        lowStock,
        cancelledAppointments,
        userRoles,
        petSpecies,
        appointmentStatus,
        isLoading,
        error,
        isMenuOpen,
        isDarkMode,
        adminEmail,
    } = useAppSelector((state) => state.home);

    const handleLogout = useCallback(() => {
        dispatch(logoutAdmin());
        navigate("/");
    }, [dispatch, navigate]);

    const handleToggleDarkMode = useCallback(() => {
        dispatch(toggleDarkMode());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchDashboardReports());
    }, [dispatch]);

    useEffect(() => {
        const role = getCurrentRole();
        if (role === "staff") {
            navigate("/appointments", { replace: true });
        }
    }, [navigate]);

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
    const isStaff = getCurrentRole() === "staff";

    return (
        <div className={`dashboard${isDarkMode ? " is-dark" : ""}`}>
            <HamburgerMenu
                adminEmail={adminEmail}
                isDarkMode={isDarkMode}
                isOpen={isMenuOpen}
                onClose={() => dispatch(closeMenu())}
                onLogout={handleLogout}
                onToggleDarkMode={handleToggleDarkMode}
            />
            <div className="dashboard-topbar">
                <HamburgerMenuToggle onClick={() => dispatch(openMenu())} />
                <Header title="Dashboard" />
            </div>

            {error && <div className="dashboard-alert">{error}</div>}

            {isLoading ? (
                <div className="dashboard-loading">Loading data...</div>
            ) : (
                <>
                    <MetricGrid revenueSummary={revenueSummary} cancelledCount={cancelledCount} />
                    <RevenueSection
                        revenueTrend={revenueTrend}
                        topServices={topServices}
                        revenueItems={revenueItems}
                        cancelledAppointments={cancelledAppointments}
                    />
                    {!isStaff && (
                        <>
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
                </>
            )}
            <Footer />
        </div>
    );
};

export default Home;
