import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const ManagerRouter = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [navigateToHome, setNavigateToHome] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  useEffect(() => {
    if (!userRole) {
      console.error("Role do usuário não encontrado no localStorage");
      setShowPopup(true);
    } else if (user && (userRole === 'UNDEFINED' || (userRole === 'ANNOUNCEMENT_ISSUER' && location.pathname === '/employee-list'))) {
      setShowPopup(true);
    }
  }, [userRole, user, location.pathname]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setNavigateToHome(true);
  };

  if (navigateToHome) {
    return <Navigate to="/" />;
  }

  if (!userRole) {
    return (
      <>
        <Dialog header="Acesso Negado" visible={showPopup} onHide={handleClosePopup} footer={<Button label="OK" onClick={handleClosePopup} />}>
          <p>Não foi encontrado o nível de acesso do usuário. Faça login novamente.</p>
        </Dialog>
      </>
    );
  }

  if (user && userRole === 'ADMIN') {
    return <Outlet />;
  } else if (user && userRole === 'ANNOUNCEMENT_ISSUER' && location.pathname !== '/employee-list') {
    return <Outlet />;
  }

  return (
    <>
      <Dialog header="Acesso Negado" visible={showPopup} onHide={handleClosePopup} footer={<Button label="OK" onClick={handleClosePopup} />}>
        <p>Você não tem permissão para acessar essa página.</p>
      </Dialog>
    </>
  );
};

export default ManagerRouter;
