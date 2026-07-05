import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
    const auth = useContext(AuthContext);

    if (auth?.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nutri-neutralBg">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-nutri-primaryDark"></div>
            </div>
        );
    }

    // jika token tidak ada, lempar user kembali ke halaman login
    if (!auth?.token) {
        return <Navigate to="/login" replace />;
    }

    // jika aman, izinkan akses masuk kehalaman anak
    return <Outlet />
};

export default ProtectedRoute;