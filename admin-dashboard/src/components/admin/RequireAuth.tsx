import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentRole } from "../../pages/admin/permissions";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const role = getCurrentRole();

    useEffect(() => {
        if (!role) {
            navigate("/", { replace: true });
        }
    }, [navigate, role]);

    if (!role) {
        return null;
    }

    return <>{children}</>;
};

export default RequireAuth;
