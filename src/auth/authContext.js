// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { guestAuth } from "../hook/apiCall";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const permissions = ["Open", "Create", "Edit", "View"];

    const logout = () => {
        localStorage.removeItem("accesstoken");
        setIsAuthenticated(false);
    };
  
    const login = async (cid,id) => {
        setIsLoading(true);

        try {
            const res = await guestAuth(cid);

            const data = res.data.data;

            if (!Boolean(data.status)) {
                logout();
                return { status: false, message: data.message };
            }

            // Only save token after successful authentication
            localStorage.setItem('accesstoken', data.token);
            localStorage.setItem('storeid', id);

            const decoded = jwtDecode(data.token);
            setIsAuthenticated(true);

            return { status: true, message: data.message };

        } catch (err) {
            logout();
            return { status: false, message: String(err.message) };
        } finally {
            setIsLoading(false);
        }
    };

    const checkToken = () => {
        const token = localStorage.getItem("accesstoken");

        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);

            // JWT exp is Unix timestamp in seconds
            const expired = !decoded.exp || decoded.exp * 1000 < Date.now();

            if (expired) {
                logout();
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {          
            logout();
        }

        setIsLoading(false);
    };

    useEffect(() => {
        checkToken();

        // Logout when token is removed from another tab
        const handleStorageChange = (event) => {
            if (event.key === "accesstoken" && !event.newValue) {
                logout();
            }

            // If another tab logs in
            if (event.key === "accesstoken" && event.newValue) {
                checkToken();
            }
        };

        // Logout when API returns 401
        const handleUnauthorized = () => {
            logout();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("unauthorized", handleUnauthorized);
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                permissions,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);