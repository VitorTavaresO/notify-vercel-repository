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

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandEmployee, setExpandEmployee] = useState(null);
  const [filter, setFilter] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("Todos");

  const permissions = [
    { label: "Todos", value: "Todos" },
    { label: "Emissor de Comunicados", value: "Emissor de comunicados" },
    { label: "Gerenciador de Cadastrados", value: "Gerenciador de cadastros" },
    { label: "Gerenciador do Sistema", value: "Gerenciador do sistema" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/archives/employeeList.json");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching the employee data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (employee) => {
    setExpandEmployee(expandEmployee === employee ? null : employee);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesNameOrSiape =
      employee.nome.toLowerCase().includes(filter.toLowerCase()) ||
      employee.siape.includes(filter);
    const matchesPermission =
      selectedPermission === "Todos" ||
      employee.permissao === selectedPermission;

    return matchesNameOrSiape && matchesPermission;
  });

  const [visible, setVisible] = useState(false);

  const footerEditPermission = (
    <div>
      <Button label="Cancelar" severity="danger" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
      <Button label="Salvar" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus className="confirm-button"/>
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
          <div className="employee-name mb-1 mt-3 ml-3">{employee.nome}</div>
          <div className="employee-cargo my-1 ml-3">{employee.cargo}</div>
          <div className="employee-siape my-1 ml-3">SIAPE: {employee.siape}</div>
        </div>
        {isExpanded && (
          <div className="extra-info">
            <div className="employee-number my-1 ml-3">Telefone: {employee.telefone}</div>
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
            src="/images/icon_role3_marked.png"
            height={`${employee.permissao == "Gerenciador de cadastros" ? "35" : "0"}`}
            style={{ padding: `${employee.permissao == "Gerenciador de cadastros" ? '0 20px 0 0' : "0 0 0 0"}` }}
            className="icon_role" />
          <img
            alt="logo"
            src="/images/icon_role4_marked.png"
            height={`${employee.permissao == "Gerenciador do sistema" ? "35" : "0"}`}
            style={{ padding: `${employee.permissao == "Gerenciador do sistema" ? '0 20px 0 0' : "0 0 0 0"}` }}
            className="icon_role"/>
        </div>

        <Button
          link
          className="edit-button"
          icon="pi pi-pencil"
          onClick={() => setVisible(true)}
        />
        <Button
          link
          className="expand-button"
          icon={`${isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}`}
          onClick={() => toggleExpand(employee)}
        />
        {/*
        <button
          className="expand-button"
          onClick={() => toggleExpand(employee)}
          aria-expanded={isExpanded}
          aria-label={`Expandir informações de ${employee.nome}`}
        >
          {isExpanded ? "-" : "+"}
        </button>
        */}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="container">
    <Helmet>
      <title>Servidores</title>
    </Helmet>
      <Dialog header="Editar Permissões" visible={visible} style={{ minWidth: '40vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerEditPermission}>

        <h3>Permissão atual: [permissão atual]</h3>
        <h3 className="-mt-3">Nova permissão: [permissão selecionada]</h3>

        <div className="grid my-5">
          <div class="col-6 md:col-3 lg:col-2">
            <div class="text-center p-1">
              <img alt="logo" height="35" className="icon_role" 
              src="/images/icon_role1.png"/>
            </div>
          </div>
          <div class="col-6 md:col-3 lg:col-2">
            <div class="text-center p-1">
              <img alt="logo" height="35" className="icon_role"
                src="/images/icon_role2.png" />
            </div>
          </div>
          <div class="col-6 md:col-3 lg:col-2">
            <div class="text-center p-1">
              <img alt="logo" height="35" className="icon_role"
              src="/images/icon_role3.png" />
            </div>
          </div>
          <div class="col-6 md:col-3 lg:col-2">
            <div class="text-center p-1">
              <img alt="logo" height="35" className="icon_role"
              src="/images/icon_role4.png" />
            </div>
          </div>
        </div>
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
          onChange={(e) => setSelectedPermission(e.value)}
          placeholder="Selecione uma permissão"
        />
      </div>
      <div className="employee-list">
        <Card title="Lista de Servidores" className="general-card">
          <Divider />
          <DataView
            value={filteredEmployees}
            layout="list"
            itemTemplate={itemTemplate}
            paginator
            rows={9}
          />
        </Card>
      </div>
    </div>
  );
}

export default EmployeeList;
