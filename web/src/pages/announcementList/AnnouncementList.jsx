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
import { Chips } from "primereact/chips";
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from "primereact/inputmask";

import './AnnouncementList.css';
import { InputNumber } from "primereact/inputnumber";

function AnnouncementList() {
    const isFilter = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [course, setCourse] = useState("Todos");
    const [className, setClassName] = useState("Todas");
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [email, setEmail] = useState([]);
    const [rA, setRA] = useState("");
    const [nomeAluno, setNomeAluno] = useState("");
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [ordem, setOrdem] = useState('recente');

    const [selectedProgram, setSelectedProgram] = useState("Todos");
    const programs = [
        { label: "Todos", value: "Todos", icon: '/images/icon_role0_marked.png' },
        { label: "Institucional", value: "Institucional", icon: '/images/flag_if.png' },
        { label: "Todos os Cursos", value: "Todos os Cursos", icon: '/images/flag_todosCursos.png' },
        { label: "Individual", value: "Individual", icon: '/images/flag_individual.png' },
        { label: "Téc. Agroindústria", value: "Téc. Agroindústria", icon: '/images/flag_agro.png' },
        { label: "Téc. Informática", value: "Téc. Informática", icon: '/images/flag_info.png' },
        { label: "Téc. Mecatrônica", value: "Téc. Mecatrônica", icon: '/images/flag_meca.png' },
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
    const [dialogTitle, setDialogTitle] = useState(null);
    const [dialogDate, setDialogDate] = useState(null);
    const [dialogClasses, setDialogClasses] = useState(null);

    useEffect(() => {
        if (!loading) {
            document.documentElement.style.setProperty('--footer-width', isFilter ? 'calc(100% - 325px)' : '100%');

            return () => {
                document.documentElement.style.setProperty('--footer-width', '100%');
            };
        }
    }, [isFilter, loading]);

    const openDialog = () => {
        setTitle("");
        setMessage("");
        setEmail([]);
        setSelectedPrograms([]);
        setSelectedClasses([]);
        setAttachments([]);

        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
        setTitle("");
        setMessage("");
        setEmail([]);
        setSelectedPrograms([]);
        setSelectedClasses([]);
        setAttachments([]);
    };

    const fileUploadRef = useRef(null);

    const handleFileSelect = (e) => {
        const maxSize = 5 * 1024 * 1024; // 5MB de tamanho máximo
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
        const maxFiles = 5;

        const newFiles = [...attachments, ...e.files].filter(file => {
            if (!allowedTypes.includes(file.type)) {
                alert(`Tipo de arquivo não permitido: ${file.name}`);
                return false;
            }
            if (file.size > maxSize) {
                alert(`Arquivo muito grande: ${file.name}. O tamanho máximo é de 5MB.`);
                return false;
            }
            return true;
        });

        if (newFiles.length > maxFiles) {
            alert(`Você só pode enviar até ${maxFiles} arquivos.`);
            return;
        }

        setAttachments(newFiles);

        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const handleRemoveFile = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title) {
            alert("O título é obrigatório");
            return;
        }
        if (!message) {
            alert("A mensagem é obrigatória");
            return;
        }

        const formData = new FormData();
        const messageData = {
            title,
            author: "Nome do Autor",
            email,
            course: selectedPrograms,
            className: selectedClasses,
            message,
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
                setShowDialog(false);
                fetchData();
                alert("Comunicado enviado com sucesso!");
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

    const alternarOrdem = () => {
        setOrdem((prev) => (prev === 'recente' ? 'antigo' : 'recente'));
    };

    const handleDialogOpen = (announcement) => {

        setSelectedAnnouncement(announcement);
        setDialogTitle(announcement.title);

        setDialogDate(formatDate(announcement.data));
        setDialogClasses(formatClasses(announcement.className));

        setVisible(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatClasses = (classes) => {

        if (classes == "Todas") return "Todos as Turmas";

        return classes
            .sort((a, b) => a - b)
            .map(classNumber => `${classNumber}º Ano`)
            .join(", ");
    };

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/messages");
            const data = await response.json();
            console.log("Dados recebidos da API:", data);

            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar os dados dos comunicados:", error);
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const filteredAnnouncements = Array.isArray(announcements)
        ? announcements.filter((announcement) => {
            const matchesTitle = announcement.title && announcement.title.toLowerCase().includes(filter.toLowerCase());
            const matchesProgram = selectedProgram === "Todos" || announcement.course.includes(selectedProgram);
            const matchesClass = selectedClass === "Todas" || announcement.className.includes(selectedClass);
            return matchesTitle && matchesProgram && matchesClass;
        })
            .sort((a, b) => {
                return ordem === "recente"
                    ? new Date(b.data) - new Date(a.data)
                    : new Date(a.data) - new Date(b.data);
            })
        : [];


    const [visible, setVisible] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleEmailChange = (e) => {
        const emails = e.value;
        const invalidEmails = emails.filter(email => !validateEmail(email));

        if (invalidEmails.length > 0) {
            alert("E-mails inválidos: " + invalidEmails.join(", "));
        } else {
            setEmail(emails);
        }
    };

    const itemTemplate = (announcement) => {
        const date = new Date(announcement.data);
        const formattedDate = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const formatClasses = (classes) => {

            if (classes == "Todas") return "Todos as Turmas";

            return classes
                .sort((a, b) => a - b)
                .map(classNumber => `${classNumber}º Ano`)
                .join(", ");
        };

        const formattedClasses = announcement.className ? formatClasses(announcement.className) : "Sem turma definida";
        const courses = announcement.course ? announcement.course.join(", ") : "Sem curso definido";

        const renderFlags = (course) => {
            const flags = [];

            if (course.includes("Téc. Agroindústria")) {
                flags.push(
                    <img alt="Téc. Agroindústria" src="/images/flag_agro.png" height="35" className="icon_role" />
                );
            }
            if (course.includes("Téc. Informática")) {
                flags.push(
                    <img alt="Téc. Informática" src="/images/flag_info.png" height="35" className="icon_role" />
                );
            }
            if (course.includes("Téc. Mecatrônica")) {
                flags.push(
                    <img alt="Téc. Mecatrônica" src="/images/flag_meca.png" height="35" className="icon_role" />
                );
            }
            if (course.includes("Individual")) {
                flags.push(
                    <img alt="Individual" src="/images/flag_individual.png" height="35" className="icon_role" />
                );
            }
            if (course.includes("Institucional")) {
                flags.push(
                    <img alt="Institucional" src="/images/flag_if.png" height="35" className="icon_role" />
                );
            }
            if (course.includes("Todos os Cursos")) {
                flags.push(
                    <img alt="Todos os Cursos" src="/images/flag_todosCursos.png" height="35" className="icon_role" />
                );
            }

            return flags;
        };

        function formatMessage(announcement) {
            const maxLength = 380;
            return announcement.message.length > maxLength
                ? announcement.message.slice(0, maxLength) + '...'
                : announcement.message;
        }

        const formattedMessage = formatMessage(announcement);

        return (
            <Card className="card-container">

                <div className="icon_role_area">
                    {renderFlags(courses)}
                </div>

                <div className="flex align-items-center flex-colum mb-3">

                    <Avatar
                        icon="pi pi-file-edit"
                        size="large"
                        shape="square"
                        className="announcement-avatar mr-2"
                    />

                    <div>
                        <div className="announcement-name ml-1">{announcement.title}</div>
                        <div className="announcement-date ml-1">Em {formattedDate}</div>
                    </div>
                </div>

                <div className="announcement-details">


                    <div className="announcement-meta">
                        <div className="announcement-course">{courses}</div>
                        <div className="announcement-classes">{formattedClasses}</div>
                    </div>

                    <div className="announcement-message mt-2">{formattedMessage}</div>

                    {announcement.annexes && announcement.annexes.length > 0 && (
                        <div className="announcement-attachments">
                            <h5>Anexos:</h5>
                            <ul>
                                {announcement.annexes.map((annex, index) => (
                                    <li key={index}>
                                        <Button
                                            label={annex.fileName}
                                            icon="pi pi-download"
                                            className="p-button-text p-button-secondary"
                                            onClick={() => window.open(`http://localhost:8080/api/messages/${announcement.id}/annexes/${annex.id}/download`, '_blank')}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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

    const handleRAChange = (value) => {
        setRA(value);

    };

    const handleNomeAlunoChange = (value) => {
        setNomeAluno(value);

        
    };

    const handleNomeResponsavelChange = (value) => {
        setNomeResponsavel(value);

        
    };


    if (loading) {
        return (
            <div className="spinner-container">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="announcementlist-container">
            <Helmet>
                <title>Comunicados - NOTIFY</title>
            </Helmet>

            <Dialog
                header={dialogTitle}
                visible={visible}
                style={{ width: '47vw', maxHeight: '80vh', marginTop: '7vh' }}
                onHide={() => setVisible(false)}>
                {selectedAnnouncement ? (
                    <div>
                        <p className="-mt-1">{selectedAnnouncement.course.join(", ")}</p>
                        <p className="-mt-3">{`${dialogClasses}`}</p>

                        <p className="">{`Publicado em: ${dialogDate}`}</p>

                        <p className="announcement-message">{selectedAnnouncement.message}</p>

                        {selectedAnnouncement.annexes && selectedAnnouncement.annexes.length > 0 && (
                            <div className="announcement-attachments">
                                <h5 className="ml-2">Anexos:</h5>
                                <ul>
                                    {selectedAnnouncement.annexes.map((annex, index) => (
                                        <li key={index}>
                                            <Button
                                                label={annex.fileName}
                                                icon="pi pi-download" 
                                                className="p-button-text p-button-secondary"
                                                onClick={() => window.open(`http://localhost:8080/api/messages/${selectedAnnouncement.id}/annexes/${annex.id}/download`, '_blank')}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (<p>Nenhum anúncio selecionado.</p>)}
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
                        <label htmlFor="program">Destinatário</label>
                        <MultiSelect
                            value={selectedPrograms}
                            options={programs.filter(program => program.value !== "Todos")}
                            onChange={(e) => setSelectedPrograms(e.value)}
                            placeholder="Selecione os cursos"
                            display="chip"
                        />
                    </div>
                    {/* Campo de E-mails para o Nível Individual */}
                    {selectedPrograms.includes("Individual") && (
                        <>
                        <div className="field">
                            <label htmlFor="title">RA do Aluno</label>
                            <InputMask
                                id="rA"
                                value={rA}
                                mask="99999999999"
                                onChange={(e) => handleRAChange(e.value)}
                                placeholder="Digite o RA do Aluno"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="title">Nome do Aluno</label>
                            <InputText
                                id="nomeAluno"
                                value={nomeAluno}    
                                onChange={(e) => handleNomeAlunoChange(e.value)}
                                placeholder="Digite o nome do Aluno"
                                disabled={/^\d{11}$/.test(rA)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="title">Nome do Responsável</label>
                            <InputText
                                id="nomeResponsavel"
                                value={nomeResponsavel}
                                onChange={(e) => handleNomeResponsavelChange(e.value)}
                                placeholder="Digite o nome do Responsável"
                                disabled={/^\d{11}$/.test(rA)}
                            />
                        </div>
                        </>
                    )}
                    <div className="field">
                        <label htmlFor="class">Turma</label>
                        <MultiSelect
                            value={selectedClasses}
                            options={classes}
                            onChange={(e) => setSelectedClasses(e.value)}
                            placeholder="Selecione as turmas"
                            display="chip"
                            disabled={selectedPrograms.includes("Institucional") || selectedPrograms.includes("Individual")}
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
                        <label htmlFor="attachments">Anexos</label>
                        <FileUpload
                            ref={fileUploadRef}
                            name="attachments"
                            mode="basic"
                            multiple
                            customUpload
                            onSelect={handleFileSelect}
                            chooseLabel="Selecionar Arquivos"
                        />
                        {/* Exibir a lista de arquivos selecionados */}
                        {attachments.length > 0 && (
                            <div className="selected-files">
                                <h5>Arquivos Selecionados:</h5>
                                <ul>
                                    {attachments.map((file, index) => (
                                        <li key={index}>
                                            {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
                                            <Button
                                                icon="pi pi-times"
                                                className="p-button-text"
                                                onClick={() => handleRemoveFile(index)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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

                <div className="flex align-items-center flex-colum  -mt-3 -mt-2" >
                    <i onClick={alternarOrdem} style={{ cursor: 'pointer', fontSize: '1.3rem' }}
                        className={`pi ${ordem === 'recente' ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down-alt'} mx-2`}>
                    </i>
                    <h4 onClick={alternarOrdem} style={{ cursor: 'pointer' }}>
                        {ordem === 'recente' ? 'Recentes - Antigos' : 'Antigos - Recentes'}
                    </h4>
                </div>

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
            <div className="cover-container"></div>
        </div>
    );

}

export default AnnouncementList;