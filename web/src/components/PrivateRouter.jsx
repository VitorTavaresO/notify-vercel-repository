import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {

    const isAuthenticated = localStorage.getItem("token")?true:false;

    return(isAuthenticated?<Outlet/>:<Navigate to="/login"/>);
} 
export default PrivateRouter;