import React, { useState, useEffect, useRef } from "react";
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

import './AnnouncementList.css';

function AnnouncementList() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [selectedPermission, setSelectedPermission] = useState("Todos");

    const permissions = [
        { label: "Todos", value: "Todos", icon: '/images/icon_role0_marked.png' },
        { label: "Emissor de Comunicados", value: "Emissor de comunicados", icon: '/images/icon_role1_marked.png' },
        { label: "Gerenciador de Cadastrados", value: "Gerenciador de cadastros", icon: '/images/icon_role3_marked.png' },
        { label: "Gerenciador do Sistema", value: "Gerenciador do sistema", icon: '/images/icon_role4_marked.png' },
    ];

    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [dialogPermission, setDialogPermission] = useState(null);

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

    const handleDialogOpen = (announcement) => {

        setSelectedAnnouncement(announcement);
        setDialogPermission(announcement.categoria);
        setVisible(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/archives/announcementList.json");
                const data = await response.json();
                setAnnouncements(data);
            } catch (error) {
                console.error("Error fetching the announcement data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAnnouncements = announcements.filter((announcement) => {
        const matchesNameOrSiape =
            announcement.titulo.toLowerCase().includes(filter.toLowerCase()) ||
            announcement.siape.includes(filter);
        const matchesPermission =
            selectedPermission === "Todos" ||
            announcement.categoria === selectedPermission;

        return matchesNameOrSiape && matchesPermission;
    });

    const [visible, setVisible] = useState(false);

    const footerEditPermission = (
        <div>
            <Button link label="Salvar" severity="info" onClick={() => setVisible(false)} className="p-button-text" autoFocus />
            <Button link label="Cancelar" severity="danger" onClick={() => setVisible(false)} className="p-button-text" />
        </div>
    );

    const itemTemplate = (announcement) => {
        return (
            <Card className={"card-container"}>
                <Avatar
                    icon="pi pi-file-edit"
                    size="large"
                    shape="square"
                    className="announcement-avatar my-1 ml-3"
                />
                <div className="announcement-details">
                    <div className="announcement-name mb-1 mt-3 ml-3">{announcement.titulo}</div>

                    <div className={`flex flex-row${announcement.curso == null ? "bg-white" : "bg-white"}`}>

                        <div className="announcement-cargo my-1 ml-3">{announcement.curso}</div>

                        <div>
                            <div className="announcement-siape my-1 ml-2 ">- {announcement.turma}</div>
                        </div>


                        <div className="announcement-siape my-1">,</div>

                        <div className="announcement-cargo my-1 ml-2">em {announcement.data}</div>
                    </div>

                    <div className="announcement-cargo my-1 ml-3 mr-8 text-justify">{announcement.mensagem}</div>

                </div>
                <div className="icon_role_area">
                    <img
                        alt="logo"
                        src="/images/icon_role0_marked.png"
                        height={`${announcement.curso == "Todas as Turmas" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/icon_role1_marked.png"
                        height={`${announcement.curso == "Téc. Informática" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/icon_role2_marked.png"
                        height={`${announcement.curso == "Téc. Mecatrônica" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/icon_role3_marked.png"
                        height={`${announcement.curso == "Téc. Agroindústria" ? "35" : "0"}`}
                        className="icon_role" />
                </div>

                <Button
                    link
                    className="view-button"
                    icon="pi pi-eye"
                    onClick={() => handleDialogOpen(announcement)}

                />
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
                <title>Servidores - NOTIFY</title>
            </Helmet>
            <Dialog draggable={false} header="Editar Permissões" visible={visible} style={{ minWidth: '35vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerEditPermission}>

                <h4 className="mt-3" style={{ color: '#667182' }}>Selecione a nova permissão de</h4>
                <h2 className="-mt-3 mb-4">{selectedAnnouncement ? selectedAnnouncement.titulo : ''}</h2>

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
            <div className="announcement-list">
                <Card title="Lista de Comunicados" className="general-card">
                    <Divider className="-mt-2 mb-4" />
                    <DataView
                        value={filteredAnnouncements}
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

export default AnnouncementList;
