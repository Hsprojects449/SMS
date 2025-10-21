// src/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, role }) => {
    const { auth } = useAuth();

    if (!auth || !auth.token) {
        return <Navigate to="/login" replace />;
    }

    if (role && auth.role != role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
