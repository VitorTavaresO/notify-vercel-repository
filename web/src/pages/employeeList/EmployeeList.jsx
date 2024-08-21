import React, { useState, useEffect } from "react";
import './EmployeeList.css';
import { Card } from "primereact/card";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { DataView } from 'primereact/dataview';
import { Avatar } from 'primereact/avatar';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandEmployee, setExpandEmployee] = useState(null);

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

    const itemTemplate = (employee) => {
        const isExpanded = expandEmployee === employee;
        return (
            <Card className={`card-container ${isExpanded ? 'expanded' : ''}`}>
                <Avatar icon="pi pi-user" size="large" shape="square" className="employee-avatar" />
                <div className="employee-details">
                    <div className="employee-name">{employee.nome}</div>
                    <div className="employee-siape">SIAPE: {employee.siape}</div>
                    <div className="employee-cargo">{employee.cargo}</div>
                </div>
                {isExpanded && (
                    <div className="extra-info">
                        <div className="employee-number">Telefone: {employee.telefone}</div>
                        <div className="employee-email">Email: {employee.email}</div>
                    </div>
                )}
                <button
                    className="expand-button"
                    onClick={() => toggleExpand(employee)}
                >
                    {isExpanded ? '-' : '+'}
                </button>
            </Card>
        );
    };

    if (loading) {
        return <div className="spinner-container"><ProgressSpinner /></div>;
    }

    return (
        <div className="background-container flex flex-column justify-content-center align-items-center">
            <Card title='Lista de Funcionários' className="general-card">
                <Divider />
                <DataView
                    value={employees}
                    layout="list"
                    itemTemplate={itemTemplate}
                    paginator
                    rows={9}
                />
            </Card>
        </div>
    );
}

export default EmployeeList;
