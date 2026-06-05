import AssessmentIcon from "@mui/icons-material/Assessment";
import CategoryIcon from "@mui/icons-material/Category";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LogoutIcon from "@mui/icons-material/Logout";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PetsIcon from "@mui/icons-material/Pets";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type HamburgerMenuProps = {
    adminEmail: string;
    isDarkMode: boolean;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onToggleDarkMode: () => void;
};

const menuItems = [
    { label: "Appointments", icon: EventAvailableIcon, path: "/appointments" },
    { label: "Medical Records", icon: MedicalServicesIcon, path: "/medical-records" },
    { label: "Pets and Customers", icon: PetsIcon, path: "/pets-customers" },
    {
        label: "Catalog",
        icon: CategoryIcon,
        children: [
            { label: "Medicine", path: "/catalog/medicine" },
            { label: "Service", path: "/catalog/service" },
        ],
    },
    {
        label: "Inventory",
        icon: Inventory2Icon,
        children: [
            { label: "Medicine Inventory", path: "/inventory/medicine" },
            { label: "Suppliers", path: "/inventory/suppliers" },
            { label: "Inventory Transactions", path: "/inventory/transactions" },
        ],
    },
    { label: "Staff", icon: LocalHospitalIcon, path: "/staff" },
    { label: "Account", icon: PeopleAltIcon, path: "/account" },
    { label: "Report", icon: AssessmentIcon, path: "/home" },
];

const HamburgerMenu = ({
    adminEmail,
    isDarkMode,
    isOpen,
    onClose,
    onLogout,
    onToggleDarkMode,
}: HamburgerMenuProps) => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <>
            <div
                className={`hamburger-menu-backdrop${isOpen ? " is-open" : ""}`}
                aria-hidden="true"
                onClick={onClose}
            />

            <aside className={`hamburger-menu${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
                <div className="hamburger-menu-logo">
                    <LocalHospitalIcon />
                    <span>VetCare</span>
                </div>

                <nav className="hamburger-menu-nav" aria-label="Admin navigation">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div className="hamburger-menu-group" key={item.label}>
                                <button
                                    className="hamburger-menu-item"
                                    type="button"
                                    onClick={() => item.path && handleNavigate(item.path)}
                                >
                                    <Icon fontSize="small" />
                                    <span>{item.label}</span>
                                </button>
                                {item.children && (
                                    <div className="hamburger-submenu">
                                        {item.children.map((child) => (
                                            <button type="button" key={child.path} onClick={() => handleNavigate(child.path)}>
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="hamburger-menu-footer">
                    <span className="hamburger-menu-email">{adminEmail}</span>
                    <button
                        className={`hamburger-menu-dark-toggle${isDarkMode ? " is-on" : ""}`}
                        type="button"
                        aria-pressed={isDarkMode}
                        onClick={onToggleDarkMode}
                    >
                        <span>Dark Mode</span>
                        {isDarkMode ? <ToggleOnIcon /> : <ToggleOffIcon />}
                    </button>
                    <button className="hamburger-menu-logout" type="button" onClick={onLogout}>
                        <LogoutIcon fontSize="small" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default HamburgerMenu;
