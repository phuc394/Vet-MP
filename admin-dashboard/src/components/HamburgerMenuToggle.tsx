import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

type HamburgerMenuToggleProps = {
    onClick: () => void;
};

const HamburgerMenuToggle = ({ onClick }: HamburgerMenuToggleProps) => {
    return (
        <button
            className="hamburger-menu-toggle"
            type="button"
            aria-label="Open menu"
            onClick={onClick}
        >
            <KeyboardArrowRightIcon />
        </button>
    );
};

export default HamburgerMenuToggle;
