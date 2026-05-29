import { PermissionAction } from "./adminResources";

type TokenPayload = {
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

const getTokenPayload = (): TokenPayload => {
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

export const hasPermission = (resourceKey: string, action: PermissionAction) => {
    const stored = parseJson<string[] | Record<string, string[]>>(localStorage.getItem("adminPermissions"));
    const permissions = stored ?? getTokenPayload().permissions;

    if (Array.isArray(permissions)) {
        return permissions.includes(`${resourceKey}:${action}`) || permissions.includes(action);
    }

    if (permissions && Array.isArray(permissions[resourceKey])) {
        return permissions[resourceKey].includes(action);
    }

    const role = getTokenPayload().role ?? localStorage.getItem("adminRole") ?? "admin";
    return role === "admin";
};
