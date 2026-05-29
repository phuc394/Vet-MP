import { ReactNode, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import HamburgerMenu from "../HamburgerMenu";
import HamburgerMenuToggle from "../HamburgerMenuToggle";
import Header from "../Header";

type AdminLayoutProps = {
    title: string;
    kicker?: string;
    description?: string;
    children: ReactNode;
};

const AdminLayout = ({ title, kicker = "Admin management", description, children }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
    const [adminEmail] = useState(() => localStorage.getItem("adminEmail") ?? "admin@vetcare.com");

    const handleToggleDarkMode = useCallback(() => {
        setIsDarkMode((currentValue) => {
            const nextValue = !currentValue;
            localStorage.setItem("darkMode", String(nextValue));
            return nextValue;
        });
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("adminEmail");
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
