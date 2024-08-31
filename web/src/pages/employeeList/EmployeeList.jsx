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
    { label: "Gerenciador do Sistema", value: "Gerenciador do sistema" },
    { label: "Gerenciador de Cadastrados", value: "Gerenciador de cadastros" },
    { label: "Emissor de Comunicados", value: "Emissor de comunicados" },
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
          className="employee-avatar m-2"
        />
        <div className="employee-details">
          <div className="employee-name m-2">{employee.nome}</div>
          <div className="employee-siape m-2">SIAPE: {employee.siape}</div>
          <div className="employee-cargo m-2">{employee.cargo}</div>
        </div>
        {isExpanded && (
          <div className="extra-info">
            <div className="employee-number m-2">
              Telefone: {employee.telefone}
            </div>
            <div className="employee-email m-2">Email: {employee.email}</div>
            <div className="employee-permission m-2">
              Permissão: {employee.permissao}
            </div>
          </div>
        )}

        <Button
          className="edit-button"
          icon="pi pi-pencil" 
          onClick={() => setVisible(true)}
        />
        <Button
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
      <Dialog header="Editar Permissões" visible={visible} style={{ width: '25vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerEditPermission}>

      </Dialog>
      <div className="filter-container">
        <h3>Filtrar Funcionários</h3>
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
        <Card title="Lista de Funcionários" className="general-card">
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
