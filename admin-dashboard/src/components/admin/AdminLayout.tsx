import { ReactNode, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleDarkMode } from "../../redux/slices/home.slice";
import Footer from "../Footer";
import HamburgerMenu from "../HamburgerMenu";
import HamburgerMenuToggle from "../HamburgerMenuToggle";
import Header from "../Header";
import "../../styles/global.css";

type AdminLayoutProps = {
    title: string;
    kicker?: string;
    description?: string;
    children: ReactNode;
};

const AdminLayout = ({ title, kicker = "Admin management", description, children }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector((state) => state.home.isDarkMode);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [adminEmail] = useState(() => localStorage.getItem("adminEmail") ?? "admin@gmail.com");

    const handleToggleDarkMode = useCallback(() => {
        dispatch(toggleDarkMode());
    }, [dispatch]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminRole");
        navigate("/");
    }, [navigate]);

    return (
        <div className={`dashboard admin-page${isDarkMode ? " is-dark" : ""}`}>
            <HamburgerMenu
                adminEmail={adminEmail}
                isDarkMode={isDarkMode}
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onLogout={handleLogout}
                onToggleDarkMode={handleToggleDarkMode}
            />
            <div className="dashboard-topbar">
                <HamburgerMenuToggle onClick={() => setIsMenuOpen(true)} />
                <Header title={title} kicker={kicker} description={description} />
            </div>
            {children}
            <Footer />
        </div>
    );
};

export default AdminLayout;
