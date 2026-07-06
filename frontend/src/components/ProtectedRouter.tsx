import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User } from "../types";

interface ProtectedRouteProps {
    allowedRoles?: Array<User['role']>;
}

const getDashboardPath = (role: User['role']) => {
    switch (role) {
        case 'ADMIN':
            return '/admin';
        case 'DOCTOR':
            return '/doctor';
        case 'SELLER':
            return '/seller';
        case 'PARENT':
        default:
            return '/parent-dashboard';
    }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const auth = useContext(AuthContext);
    const location = useLocation();

    if (auth?.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nutri-neutralBg">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-nutri-primaryDark"></div>
            </div>
        );
    }

    if (!auth?.token || !auth.user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
        return <Navigate to={getDashboardPath(auth.user.role)} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;