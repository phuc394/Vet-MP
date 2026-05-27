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

type HamburgerMenuProps = {
    adminEmail: string;
    isDarkMode: boolean;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onToggleDarkMode: () => void;
};

const menuItems = [
    { label: "Users", icon: PeopleAltIcon },
    { label: "Appointments", icon: EventAvailableIcon },
    { label: "Catalog", icon: CategoryIcon },
    { label: "Inventory", icon: Inventory2Icon },
    { label: "Medical Record", icon: MedicalServicesIcon },
    { label: "Pet", icon: PetsIcon },
    { label: "Report", icon: AssessmentIcon },
];

const HamburgerMenu = ({
    adminEmail,
    isDarkMode,
    isOpen,
    onClose,
    onLogout,
    onToggleDarkMode,
}: HamburgerMenuProps) => {
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
                            <button className="hamburger-menu-item" type="button" key={item.label}>
                                <Icon fontSize="small" />
                                <span>{item.label}</span>
                            </button>
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
