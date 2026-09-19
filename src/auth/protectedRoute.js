// src/components/ProtectedRoute.js
import {  Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";
import { LoaderCircle } from "lucide-react";

const ProtectedRoute = ({ permission }) => {
   const { isAuthenticated, permissions, isLoading } = useAuth();

    if (isLoading ) {
        return <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999, // Ensure it's on top
            }}
        >
              <LoaderCircle className="h-12 w-12 animate-spin " />
        </div>
    }
     
     if (!isAuthenticated) {
       const storeId = localStorage.getItem("storeid");
        if (!storeId) {
            return <Navigate to="/" replace />;
        }
        return <Navigate to={`/${storeId}`} replace />;
    }

    if (permission && !permissions.includes(permission)) {
       return <Navigate to="/404" replace />;
    }

    return <Outlet/> ;
};

export default ProtectedRoute;
