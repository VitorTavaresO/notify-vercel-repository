import React, { useState, useEffect } from "react";
import "./GuardianList.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { fetchGuardians } from "../../validation/APITranslator";

function GuardianList() {
    const [guardians, setGuardians] = useState([]);
    const [expandGuardian, setExpandGuardian] = useState(null);
    const [filter, setFilter] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Todos");
    const [sortOrder, setSortOrder] = useState("A-Z");

    const statusOptions = [
        { label: "Todos", value: "Todos" },
        { label: "Ativo", value: "Ativo" },
        { label: "Inativo", value: "Inativo" }
    ];

    const sortOptions = [
        { label: "A a Z", value: "A-Z" },
        { label: "Z a A", value: "Z-A" }
    ];

    useEffect(() => {
        const loadGuardians = async () => {
            const data = await fetchGuardians();
            setGuardians(data);
        };
        loadGuardians();
    }, []);


    const toggleExpand = (guardian) => {
        setExpandGuardian(expandGuardian === guardian ? null : guardian);
    };

    const filteredGuardians = guardians.filter((guardian) => {
        const matchesName = guardian.name.toLowerCase().includes(filter.toLowerCase());
        const matchesStatus = selectedStatus === "Todos" || guardian.status === selectedStatus;
        return matchesName && matchesStatus;
    });

    const sortedAndFilteredGuardians = filteredGuardians.sort((a, b) => {
        if (sortOrder === "A-Z") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const itemTemplate = (guardian) => {
        const isExpanded = expandGuardian === guardian;
        return (
            <Card className={`card-container ${isExpanded ? "expanded" : ""}`}>
                <Avatar
                    icon="pi pi-user"
                    size="large"
                    shape="square"
                    className="guardian-avatar my-1 ml-3"
                />
                <div className="guardian-details">
                    <div className="guardian-name mb-1 mt-3 ml-3">{guardian.name}</div>
                    <div className="guardian-cargo my-1 ml-3">Aluno: {guardian.studentName}</div>
                </div>
                {isExpanded && (
                    <div className="extra-info">
                        <div className="student-ra my-1 ml-3">RA: {guardian.studentRA}</div>
                        <div className="guardian-number my-1 ml-3">Telefone: {guardian.phone}</div>
                        <div className="guardian-email my-1 ml-3">Email: {guardian.email}</div>
                        <div className="guardian-status my-1 ml-3">Status: {guardian.status}</div>
                        <div className="guardian-course my-1 ml-3">Curso: {guardian.course}</div>
                        <div className="guardian-course-year my-1 ml-3">Ano: {guardian.courseYear}</div>
                    </div>
                )}
                <Button
                    link
                    className="expand-button"
                    icon={`${isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}`}
                    onClick={() => toggleExpand(guardian)}
                />
            </Card>
        );
    };

    return (
        <div className="container">
            <div className="filter-container">
                <h3>Filtrar Responsável</h3>
                <InputText
                    placeholder="Digite o nome do Resposável"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-input"
                />
                <Dropdown
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={(e) => setSelectedStatus(e.value)}
                    placeholder="Selecione um status"
                    className="filter-input"
                />
                <Dropdown
                    value={sortOrder}
                    options={sortOptions}
                    onChange={(e) => setSortOrder(e.value)}
                    placeholder="Ordenar"
                    className="filter-input"

                />
            </div>
            <div className="guardian-list">
                <Card title="Lista de Responsáveis" className="general-card">
                    <DataView
                        value={filteredGuardians}
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

export default GuardianList;
