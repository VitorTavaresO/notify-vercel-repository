import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserService from "../services/UserService";

const ManagerRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const userService = new UserService();
        try {
          const role = await userService.getUserRole(user.siape);
          setIsAuthenticated(true);
          setHasRequiredRole(role === "ADMIN");
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      setLoading(false);
    };

    checkUserRole();
  }, ["ADMIN"]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/401" />;
  }

  return <Outlet />;
};

export default ManagerRouter;
