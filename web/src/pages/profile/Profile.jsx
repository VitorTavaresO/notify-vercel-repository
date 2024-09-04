import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';




const ProfileCard = () => {
    const [employee, setEmployee] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/archives/employeeList.json");
                const data = await response.json();
                if(data.length > 0){
                    setEmployee(data[0]);
                }
            } catch (error) {
                console.error('Error fetching the employee data:', error);
            }
        };
        fetchData();
    }, []);

    const renderPermissionTag = () => {
        switch (employee.permissao) {
            case "Gerenciador do sistema":
                return <Tag className="function-tag" severity="info" value="Gerenciador do Sistema" />;
            case "Gerenciador de cadastros":
                return <Tag className="function-tag" severity="success" value="Gerenciador de Cadastros" />;
            case "Emissor de comunicados":
                return <Tag className="function-tag" severity="warning" value="Emissor de Comunicados" />;
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <Card className="profile-card">
                <div className="profile-header">
                    <Avatar image="/images/profile-picture.png" size="xlarge" shape="circle" className="profile-avatar" />
                    <div className="profile-info">
                        <h2>{employee.nome}</h2>
                        <p>SIAPE: {employee.siape}</p>
                        <div className="functions">
                            {renderPermissionTag()}
                        </div>
                    </div>
                </div>

                <Divider />

                <div className="p-d-flex p-flex-wrap">
                    <div className="profile-details p-mr-3">
                        <div className="detail-item">
                            <strong>Cargo</strong>
                            <InputText value={employee.cargo} disabled className="itemText" />
                        </div>
                        <div className="detail-item">
                            <strong>CPF</strong>
                            <InputText value="000.000.000-00" disabled className="itemText" />
                        </div>
                        <div className="detail-item">
                            <strong>Telefone</strong>
                            <InputText value={employee.telefone} disabled className="itemText" />
                        </div>
                        <div className="detail-item">
                            <strong>E-Mail</strong>
                            <InputText value={employee.email} disabled className="itemText" />
                        </div>
                        <div className="profile-footer">
                            <Button label="Alterar Senha" className="p-button-danger" text />
                            <Button label="Editar Perfil" className="p-button-primary" text />
                        </div>
                    </div>
                    <Divider layout='vertical' />
                    <div className="communications p-mr-3">
                        <h3>Últimos Comunicados:</h3>
                        <div className="communication-item">
                            <h4>Título do Comunicado nº1</h4>
                            <p>Para: Todos</p>
                            <p>Data: 08/08/2024</p>
                            <p>DescriçãoDoComunicado...</p>
                        </div>
                        <div className="communication-item">
                            <h4>Título do Comunicado nº2</h4>
                            <p>Para: 1º Ano</p>
                            <p>Data: 22/08/2024</p>
                            <p>DescriçãoDoComunicado...</p>
                        </div>
                        <Button label="Ver Todos" className="p-button-link" />
                    </div>
                </div>
            </Card>
        </div>

    );
};

export default ProfileCard;
