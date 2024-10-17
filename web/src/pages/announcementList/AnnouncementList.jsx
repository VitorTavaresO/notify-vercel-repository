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
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from "primereact/fileupload";


import './AnnouncementList.css';

function AnnouncementList() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [course, setCourse] = useState("Todos");
    const [className, setClassName] = useState("Todas");

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
        { label: "1° Ano", value: "1" },
        { label: "2° Ano", value: "2" },
        { label: "3° Ano", value: "3" },
        { label: "4° Ano", value: "4" },
        { label: "Todas as Turmas", value: "Todas" },
    ];

    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [dialogProgram, setDialogProgram] = useState(null);

    const openDialog = () => {
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
        setTitle("");
        setMessage("");
        setAttachments([]);
        setCourse("Todos");
        setClassName("Todas");
    };

    const handleSubmit = async () => {
        const formData = new FormData();
    
        const messageData = {
            title: title,
            author: "Nome do Autor",
            course: course,
            className: className,
            message: message
        };
    
        formData.append("message", JSON.stringify(messageData));
    
        attachments.forEach(file => {
            formData.append("files", file);
        });
    
        try {
            const response = await fetch("http://localhost:8080/api/messages", {
                method: "POST",
                body: formData,
            });
        
            if (response.ok) {
                console.log("Mensagem enviada com sucesso!");
                setShowDialog(false);
                fetchData();
            } else {
                const errorText = await response.text();
                console.error("Erro ao enviar a mensagem:", errorText);
            }
        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
        }
    };
    
    


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

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/messages");
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching the announcement data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredAnnouncements = announcements
        .filter((announcement) => {
            const matchesTitle =
                announcement.title && announcement.title.toLowerCase().includes(filter.toLowerCase());
            const matchesProgram =
                selectedProgram === "Todos" || announcement.course === selectedProgram;
            const matchesClass =
                selectedClass === "Todas" || announcement.className === selectedClass;

            return matchesTitle && matchesProgram && matchesClass;
        })
        .sort((a, b) => new Date(b.data) - new Date(a.data));


    const [visible, setVisible] = useState(false);

    const footerEditProgram = (
        <div>
            <Button link label="Salvar" severity="info" onClick={() => setVisible(false)} className="p-button-text" autoFocus />
            <Button link label="Cancelar" severity="danger" onClick={() => setVisible(false)} className="p-button-text" />
        </div>
    );

    const itemTemplate = (announcement) => {
        const date = new Date(announcement.data);
        const formattedDate = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        return (
            <Card className={"card-container"}>
                <Avatar
                    icon="pi pi-file-edit"
                    size="large"
                    shape="square"
                    className="announcement-avatar my-1 ml-3"
                />
                <div className="announcement-details">
                    <div className="announcement-name mb-1 mt-3 ml-3">{announcement.title}</div>

                    <div className="flex flex-row">
                        <div className="announcement-cargo my-1 ml-3">{announcement.course}</div>

                        <div className={`${announcement.className === "" ? "hidden" : "block"}`}>
                            <div className="announcement-siape my-1 ml-2 ">- {announcement.className}° ano</div>
                        </div>

                        <div className="announcement-siape my-1">,</div>
                        <div className="announcement-cargo my-1 ml-2">em {formattedDate}</div>
                    </div>

                    <div className="announcement-cargo my-1 ml-3 mr-8 text-justify">{announcement.mensage}</div>
                </div>
                <div className="icon_role_area">
                    <img
                        alt="logo"
                        src="/images/flag_todosCursos.png"
                        height={`${announcement.course === "Todos os Cursos" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/flag_info.png"
                        height={`${announcement.course === "Téc. Informática" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/flag_meca.png"
                        height={`${announcement.course === "Téc. Mecatrônica" ? "35" : "0"}`}
                        className="icon_role" />
                    <img
                        alt="logo"
                        src="/images/flag_agro.png"
                        height={`${announcement.course === "Téc. Agroindústria" ? "35" : "0"}`}
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
                <title>Comunicados - NOTIFY</title>
            </Helmet>

            {/* Dialog para Editar Permissões */}
            <Dialog
                draggable={false}
                header="Editar Permissões"
                visible={visible}
                style={{ minWidth: '35vw' }}
                onHide={() => setVisible(false)}
                footer={footerEditProgram}
            >
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

            {/* Dialog para Novo Comunicado */}
            <Dialog
                className="new-announcement"
                header="Novo Comunicado"
                visible={showDialog}
                style={{ width: '50vw' }}
                modal
                onHide={closeDialog}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={closeDialog} className="p-button-text" />
                        <Button label="Enviar" icon="pi pi-check" onClick={handleSubmit} autoFocus />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="title">Título</label>
                        <InputText
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite o título do comunicado"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="message">Comunicado</label>
                        <InputTextarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            placeholder="Digite o conteúdo do comunicado"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="program">Curso</label>
                        <Dropdown
                            value={course}
                            options={programs}
                            onChange={(e) => setCourse(e.value)}
                            placeholder="Selecione o curso"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="class">Turma</label>
                        <Dropdown
                            value={className}
                            options={classes}
                            onChange={(e) => setClassName(e.value)}
                            placeholder="Selecione a turma"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="attachments">Anexos</label>
                        <FileUpload
                            name="attachments"
                            mode="basic"
                            multiple
                            customUpload
                            onSelect={(e) => setAttachments(prevAttachments => [...prevAttachments, ...e.files])} // Acumula arquivos no estado
                            chooseLabel="Escolher Arquivos"
                        />

                    </div>
                </div>
            </Dialog>

            {/* Filtros */}
            <div className="filter-container">
                <h3>Filtrar Comunicado</h3>
                <InputText
                    placeholder="Digite o título"
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
                <Button className="button-new" label="Novo Comunicado" icon="pi pi-plus" onClick={openDialog} />
            </div>

            {/* Lista de Comunicados */}
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
