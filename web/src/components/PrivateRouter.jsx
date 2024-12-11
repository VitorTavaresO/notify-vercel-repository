import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  const isAuthenticaded = localStorage.getItem("user");
  return isAuthenticaded ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRouter;
