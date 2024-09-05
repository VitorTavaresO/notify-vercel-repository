import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputMask } from 'primereact/inputmask';
        


const ProfileCard = () => {
    const [employee, setEmployee] = useState({});
    const [editedEmail, setEditedEmail] = useState('');
    const [editedPhone, setEditedPhone] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/archives/employeeList.json");
                const data = await response.json();
                if (data.length > 0) {
                    setEmployee(data[4]);
                    setEditedEmail(data[4].email);
                    setEditedPhone(data[4].telefone);
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

    const confirmEdit = () => {
        confirmDialog({
            message: 'Tem certeza de que deseja alterar o perfil?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Cancelar',
            accept: () => handleProfileEdit(),
            reject: () => console.log('Alteração cancelada')
        });
    };

    const changePassword = () => {
        confirmDialog({
            message: 'Foi enviado um email com link para alteralçaõ de senha.',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Cancelar',
            accept: () => console.log('Senha alterada'),
            reject: () => console.log('Alteração cancelada')
        });
    };

    const handleProfileEdit = () => {
        const updatedEmployee = { ...employee, email: editedEmail, telefone: editedPhone };
        setEmployee(updatedEmployee);
        console.log('Perfil atualizado:', updatedEmployee);
    };

    return (
        <div className="container">
            <ConfirmDialog visible={visible} onHide={() => setVisible(false)} />             
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
                            <InputText value={employee.cpf} disabled className="itemText" />
                        </div>
                        <div className="detail-item">
                            <strong>E-Mail</strong>
                            <InputText value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="itemText" />
                        </div>
                        <div className="detail-item">
                            <strong>Telefone</strong>
                            <InputMask mask="(99) 99999-9999" value={editedPhone} onChange={(e) => setEditedPhone(e.value)} className="itemText" />
                        </div>
                        <div className="profile-footer">
                            <Button label="Alterar Senha" className="p-button-danger" text onClick={changePassword} />
                            <Button label="Editar Perfil" className="p-button-primary" text onClick={confirmEdit} />
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
