import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem("authData");
        return stored ? JSON.parse(stored) : null;
    });
    useEffect(() => {
        const syncLogout = (event) => {
            if (event.key == "authData" && event.newValue == null) {
                setAuth(null);
            }
        };

        window.addEventListener("storage", syncLogout);
        return () => window.removeEventListener("storage", syncLogout);
    }, []);

    // Whenever auth.token changes, set or remove the default header
    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [auth]);



    const login = (data) => {
        localStorage.setItem("authData", JSON.stringify(data));
        setAuth(data);
    };

    const logout = () => {
        localStorage.removeItem("authData");
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
