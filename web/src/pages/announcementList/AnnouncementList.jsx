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
    
    const [selectedProgram, setSelectedProgram] = useState("Todos");
    const programs = [
        { label: "Todos", value: "Todos", icon: '/images/icon_role0_marked.png' },
        { label: "Téc. Agroindústria", value: "Téc. Agroindústria", icon: '/images/flag_agro.png' },
        { label: "Téc. Informática", value: "Téc. Informática", icon: '/images/flag_info.png' },
        { label: "Téc. Mecatrônica", value: "Téc. Mecatrônica", icon: '/images/flag_meca.png' },
        { label: "Todos os Cursos", value: "Todos os Cursos", icon: '/images/flag_todosCursos.png' },
    ];

    const [selectedClass, setSelectedClass] = useState("Todas");
    const classes = [
        { label: "1° Ano", value: "1"},
        { label: "2° Ano", value: "2"},
        { label: "3° Ano", value: "3"},
        { label: "4° Ano", value: "4"},
        { label: "Todas as Turmas", value: "Todas"},
    ];

    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [dialogProgram, setDialogProgram] = useState(null);

    const programsFilterTemplate = (option) => {
        return (
            <div className="p-d-flex p-ai-center">
                <img alt={option.label} src={option.icon}
                    width="20" className="mr-3"
                />
                <span>{option.label}</span>
            </div>
        );
    };

    const classesFilterTemplate = (option) => {
        return (
            <div className="p-d-flex p-ai-center">
                <span>{option.label}</span>
            </div>
        );
    };

    const handleDialogOpen = (announcement) => {

        setSelectedAnnouncement(announcement);
        setDialogProgram(announcement.categoria);
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
        const matchesProgram =
            selectedProgram === "Todos" ||
            announcement.curso === selectedProgram;
        const matchesClass = 
            selectedClass === "Todas" ||
            announcement.turma === selectedClass;

        return matchesNameOrSiape && matchesProgram && matchesClass;
    });

    const [visible, setVisible] = useState(false);

    const footerEditProgram = (
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

                    <div className="flex flex-row">
                        <div className="announcement-cargo my-1 ml-3">{announcement.curso}</div>

                        <div className={`${announcement.turma == "" ? "hidden" : "block"}`}>
                            <div className="announcement-siape my-1 ml-2 ">- {announcement.turma}° ano</div></div>

                        <div className="announcement-siape my-1">,</div>
                        <div className="announcement-cargo my-1 ml-2">em {announcement.data}</div>
                    </div>

                    <div className="announcement-cargo my-1 ml-3 mr-8 text-justify">{announcement.mensagem}</div>
                </div>
                <div className="icon_role_area">
                    <img
                        alt="logo"
                        src="/images/flag_todosCursos.png"
                        height={`${announcement.curso == "Todos os Cursos" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/flag_info.png"
                        height={`${announcement.curso == "Téc. Informática" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/flag_meca.png"
                        height={`${announcement.curso == "Téc. Mecatrônica" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/flag_agro.png"
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
            <Dialog draggable={false} header="Editar Permissões" visible={visible} style={{ minWidth: '35vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerEditProgram}>

                <h4 className="mt-3" style={{ color: '#667182' }}>Selecione a nova permissão de</h4>
                <h2 className="-mt-3 mb-4">{selectedAnnouncement ? selectedAnnouncement.titulo : ''}</h2>

                <Dropdown
                    value={dialogProgram}
                    options={programs.filter(program => program.value !== "Todos")}
                    itemTemplate={programsFilterTemplate}
                    onChange={(e) => setDialogProgram(e.value)}
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
                    value={selectedProgram}
                    options={programs}
                    itemTemplate={programsFilterTemplate}
                    onChange={(e) => setSelectedProgram(e.value)}
                    placeholder="Selecione o curso"
                />

                <Dropdown
                    value={selectedClass}
                    options={classes}
                    itemTemplate={classesFilterTemplate}
                    onChange={(e) => setSelectedClass(e.value)}
                    placeholder="Selecione a turma"
                    className="mt-3"
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
