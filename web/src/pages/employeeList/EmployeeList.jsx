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

    const itemTemplate = (employee) => {
        return (
            <Card className="card-container">
                <Avatar icon="pi pi-user" size="large" shape="square" />
                <div>
                    <div>{employee.nome}</div>
                    <div>SIAPE: {employee.siape}</div>
                    <div>{employee.cargo}</div>
                </div>
                <Divider />
            </Card>
        );
    };

    if (loading) {
        return <div className="spinner-container"><ProgressSpinner /></div>;
    }

    return (
        <div className="background-container flex flex-column justify-content-center align-items-center">
            <Card title='Lista de Funcionários'>
            <DataView 
                value={employees} 
                layout="grid" 
                itemTemplate={itemTemplate} 
                paginator
                rows={9}
            />
            </Card>
        </div>
    );
}

export default EmployeeList;
