import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ManagerRouter = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!userRole) {
    console.error("Role do usuário não encontrado no localStorage");
    return <Navigate to="/" />;
  }

  if (user && userRole === 'ADMIN') {
    return <Outlet />;
  }

  if (user && userRole === 'ANNOUNCEMENT_ISSUER' && location.pathname !== '/employee-list') {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default ManagerRouter;
