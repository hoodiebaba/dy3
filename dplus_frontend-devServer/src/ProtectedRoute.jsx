import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuth = localStorage.getItem("auth");

    if (!isAuth || isAuth === "false") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
