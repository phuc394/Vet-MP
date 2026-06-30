import { PermissionAction } from "./adminResources";

type TokenPayload = {
    user_id?: number;
    role?: string;
    permissions?: string[] | Record<string, string[]>;
};

const parseJson = <T,>(value: string | null): T | null => {
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
};

export const getTokenPayload = (): TokenPayload => {
    const token = localStorage.getItem("accessToken");
    const payload = token?.split(".")[1];
    if (!payload) {
        return {};
    }
    try {
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as TokenPayload;
    } catch {
        return {};
    }
};

export const getCurrentRole = () => getTokenPayload().role ?? localStorage.getItem("adminRole") ?? null;

export const getCurrentUserId = () => getTokenPayload().user_id;

export const hasPermission = (resourceKey: string, action: PermissionAction) => {
    const stored = parseJson<string[] | Record<string, string[]>>(localStorage.getItem("adminPermissions"));
    const permissions = stored ?? getTokenPayload().permissions;

    if (Array.isArray(permissions)) {
        return permissions.includes(`${resourceKey}:${action}`) || permissions.includes(action);
    }

    if (permissions && Array.isArray(permissions[resourceKey])) {
        return permissions[resourceKey].includes(action);
    }

    const role = getCurrentRole();

    if (role === "staff") {
        const staffPermissions: Record<string, PermissionAction[]> = {
            appointments: ["edit", "delete"],
            "medical-records": ["create", "edit", "delete"],
        };
        return staffPermissions[resourceKey]?.includes(action) ?? false;
    }

    if (role === "admin") {
        if (resourceKey === "medical-records") {
            return false;
        }
        return true;
    }

    return false;
};
