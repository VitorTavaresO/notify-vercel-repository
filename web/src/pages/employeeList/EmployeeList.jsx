import React, { useState, useEffect, useRef } from "react";
import "./EmployeeList.css";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { Button } from 'primereact/button';
import { DataView } from "primereact/dataview";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from 'primereact/dialog';
import { Helmet } from 'react-helmet';
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const isFilter = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandEmployee, setExpandEmployee] = useState(null);
  const [filter, setFilter] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("Todos");
  const [selectedRole, setSelectedRole] = useState("");
  const userService = new UserService();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const permissions = [
    { label: "Todos", value: "Todos", icon: '/images/icon_role0_marked.png' },
    { label: "Emissor de Comunicados", value: "Emissor de comunicados", icon: '/images/icon_role1_marked.png' },
    { label: "Gerenciador do Sistema", value: "Gerenciador do sistema", icon: '/images/icon_role4_marked.png' },
  ];

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dialogPermission, setDialogPermission] = useState(null);

  useEffect(() => {
    if (!loading) {
      document.documentElement.style.setProperty('--footer-width', isFilter ? 'calc(100% - 325px)' : '100%');
  
      return () => {
        document.documentElement.style.setProperty('--footer-width', '100%');
      };
    }
  }, [isFilter, loading]);

  const permissionsFilterTemplate = (option) => {
    return (
      <div className="p-d-flex p-ai-center">
        <img alt={option.label} src={option.icon}
          width="20" className="mr-3"
        />
        <span>{option.label}</span>
      </div>
    );
  };

  const handleDialogOpen = (employee) => {
    setSelectedEmployee(employee);
    setDialogPermission(employee.permissao);
    setVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Erro ao buscar os dados dos usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const savePermission = async () => {
    if (!selectedEmployee || !dialogPermission) return;

    try {
      const response = await fetch(`http://localhost:8080/api/user/update-permission/${selectedEmployee.siape}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: dialogPermission }), 
      });

      if (response.ok) {
        const updatedEmployees = employees.map(employee =>
          employee.siape === selectedEmployee.siape
            ? { ...employee, permissao: dialogPermission }
            : employee
        );
        setEmployees(updatedEmployees);
        setVisible(false);
        console.log("Permissão atualizada com sucesso!");
      } else {
        console.error("Falha ao atualizar a permissão.");
      }
    } catch (error) {
      console.error("Erro ao atualizar a permissão:", error);
    }
  };

  const saveUser = async (user) => {
    try {
      let role;
      switch (selectedRole) {
        case "Emissor de Comunicados":
          role = "ANNOUNCEMENT_ISSUER";
          break;
        case "Gerenciador do Sistema":
          role = "ADMIN";
          break;
        default:
          role = "UNDEFINED";
          break;
      }
      await userService.updateUserRole(user.siape, role);
      navigate("/employee-list");

      console.log("Permissão atualizada com sucesso!");
    } catch (error) {
      console.error("Error atualizando a permissão do usuário:", error);
    }
  };

  const toggleExpand = (employee) => {
    setExpandEmployee(expandEmployee === employee ? null : employee);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesNameOrSiape =
      employee.name.toLowerCase().includes(filter.toLowerCase()) ||
      employee.siape.includes(filter);
    const matchesPermission =
      selectedPermission === "Todos" ||
      employee.permissao === selectedPermission;

    return matchesNameOrSiape && matchesPermission;
  });

  const [visible, setVisible] = useState(false);

  const footerEditPermission = (
    <div>
      <Button label="Salvar" severity="info" onClick={savePermission} className="p-button-text" autoFocus />
      <Button label="Cancelar" severity="danger" onClick={() => setVisible(false)} className="p-button-text" />
    </div>
  );

  const itemTemplate = (employee) => {
    const isExpanded = expandEmployee === employee;
    return (
      <Card className={`card-container ${isExpanded ? "expanded" : ""}`}>
        <Avatar
          icon="pi pi-user"
          size="large"
          shape="square"
          className="employee-avatar my-1 ml-3"
        />
        <div className="employee-details">
          <div className="employee-name mb-1 mt-3 ml-3">{employee.name}</div>
          <div className="employee-cargo my-1 ml-3">{employee.position}</div>
          <div className="employee-siape my-1 ml-3">SIAPE: {employee.siape}</div>
        </div>
        {isExpanded && (
          <div className="extra-info">
            <div className="employee-number my-1 ml-3">Telefone: {employee.phone}</div>
            <div className="employee-email my-1 ml-3">Email: {employee.email}</div>
            <div className="employee-permission my-1 ml-3">Permissão de Sistema: {employee.permissao}</div>
          </div>
        )}
        <div className="icon_role_area">
          <img
            alt="logo"
            src="/images/icon_role1_marked.png"
            height={`${employee.permissao == "Emissor de comunicados" ? "35" : "0"}`}
            style={{ padding: `${employee.permissao == "Emissor de comunicados" ? '0 20px 0 0' : "0 0 0 0"}` }}
            className="icon_role" />
          {/* style necessário apenas caso usuário tiver mais de uma role*/}
          <img
            alt="logo"
            src="/images/icon_role4_marked.png"
            height={`${employee.permissao == "Gerenciador do sistema" ? "35" : "0"}`}
            style={{ padding: `${employee.permissao == "Gerenciador do sistema" ? '0 20px 0 0' : "0 0 0 0"}` }}
            className="icon_role" />
        </div>

        <Button
          link
          className="edit-button"
          icon="pi pi-pencil"
          onClick={() => handleDialogOpen(employee)}

        />
        <Button
          link
          className="expand-button"
          icon={`${isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}`}
          onClick={() => toggleExpand(employee)}
        />
      </Card>
    );
  };

  const handleButtonClick = () => {
    if (user.role !== 'ADMIN') {
      alert('Você não tem permissão para acessar esta funcionalidade.');
    } else {
      // Ação permitida para ADMIN
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="employeelist-container">
      <Helmet>
        <title>Servidores - NOTIFY</title>
      </Helmet>
      <Dialog draggable={false} header="Editar Permissões" visible={visible} style={{ minWidth: '35vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerEditPermission}>

        <h4 className="mt-3" style={{ color: '#667182' }}>Selecione a nova permissão de</h4>
        <h2 className="-mt-3 mb-4">{selectedEmployee ? selectedEmployee.nome : ''}</h2>

        <Dropdown
          value={dialogPermission}
          options={permissions.filter(permission => permission.value !== "Todos")}
          itemTemplate={permissionsFilterTemplate}
          onChange={(e) => setDialogPermission(e.value)}
          placeholder="Selecione uma permissão"
          className="w-full"
        />

      </Dialog>

      <div className="filter-container">
        <h3>Filtrar Servidor</h3>
        <InputText
          placeholder="Digite o nome ou SIAPE"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <Dropdown
          value={selectedPermission}
          options={permissions}
          itemTemplate={permissionsFilterTemplate}
          onChange={(e) => setSelectedPermission(e.value)}
          placeholder="Selecione uma permissão"
        />
      </div>
      <div className="employee-list">
        <Card title="Lista de Servidores" className="general-card">
          <Divider className="-mt-2 mb-4" />
          <DataView
            value={filteredEmployees}
            layout="list"
            itemTemplate={itemTemplate}
            paginator
            rows={9}
          />
        </Card>
      </div>
      <div className="cover-container"></div>
      <Button label="Ação Restrita" onClick={handleButtonClick} />
    </div>
  );
}

export default EmployeeList;
