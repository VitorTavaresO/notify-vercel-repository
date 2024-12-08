import React, { useState, useEffect } from "react";
import "./Profile.css";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputMask } from "primereact/inputmask";
import { Dialog } from "primereact/dialog";
import { Paginator } from "primereact/paginator";

const ProfileCard = () => {
  const [employee, setEmployee] = useState({});
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [visible, setVisible] = useState(false);
  const [memos, setMemos] = useState([]);
  const [showAllMemos, setShowAllMemos] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const siape = user.siape;

      console.log("SIAPE:", siape);
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/siape/${siape}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setEmployee(data);
        setEditedEmail(data.email);
        setEditedPhone(data.telefone);
      } catch (error) {
        console.error("Erro ao carregar os dados do perfil:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/messages", {
          method: "GET",
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          const sortedMessages = data.sort(
            (a, b) => new Date(b.data) - new Date(a.data)
          );
          setMemos(sortedMessages);
        } else {
          setMemos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar as mensagens:", error);
        setMemos([]);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatClasses = (classes) => {
    if (classes === "Todas") return "Todas as Turmas";
    return classes
      .sort((a, b) => a - b)
      .map((classNumber) => `${classNumber}º Ano`)
      .join(", ");
  };

  function formatMessage(message) {
    const maxLength = 380;
    return message.length > maxLength
      ? message.slice(0, maxLength) + "..."
      : message;
  }

  const renderPermissionTag = () => {
    switch (employee.position) {
      case "Gerenciador do sistema":
        return (
          <Tag
            className="function-tag"
            severity="info"
            value="Gerenciador do Sistema"
          />
        );
      case "Gerenciador de cadastros":
        return (
          <Tag
            className="function-tag"
            severity="success"
            value="Gerenciador de Cadastros"
          />
        );
      case "Emissor de comunicados":
        return (
          <Tag
            className="function-tag"
            severity="warning"
            value="Emissor de Comunicados"
          />
        );
      default:
        return (
          <Tag
            className="function-tag"
            severity="warning"
            value={employee.position}
          />
        );
    }
  };

  const changePassword = () => {
    confirmDialog({
      message: "Foi enviado um email com link para alteração de senha.",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Cancelar",
      accept: () => console.log("Senha alterada"),
      reject: () => console.log("Alteração cancelada"),
    });
  };

  const confirmEdit = () => {
    confirmDialog({
      message: "Tem certeza de que deseja alterar o perfil?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Cancelar",
      accept: () => handleProfileEdit(),
      reject: () => console.log("Alteração cancelada"),
    });
  };

  const handleProfileEdit = async () => {
    const siape = localStorage.getItem("siape");

    const updatedEmployee = {
      email: editedEmail,
      phone: editedPhone,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/user/update-contact/${siape}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEmployee),
        }
      );

      if (response.ok) {
        setEmployee((prevState) => ({
          ...prevState,
          email: editedEmail,
          phone: editedPhone,
        }));
        console.log("Perfil atualizado com sucesso!");
      } else {
        console.error("Falha ao atualizar o perfil.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const memosPaginated = memos.slice(first, first + rows);

  return (
    <div className="profile-container">
      <ConfirmDialog visible={visible} onHide={() => setVisible(false)} />
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar
            image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
            size="xlarge"
            shape="circle"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>{employee.name}</h2>
            <p>SIAPE: {employee.siape}</p>
            <div className="functions">{renderPermissionTag()}</div>
          </div>
        </div>

        <Divider />

        <div className="p-d-flex p-flex-wrap">
          <div className="profile-details p-mr-3">
            <div className="detail-item">
              <strong>Cargo</strong>
              <InputText
                value={employee.position}
                disabled
                className="itemText"
              />
            </div>
            <div className="detail-item">
              <strong>CPF</strong>
              <InputText value={employee.cpf} disabled className="itemText" />
            </div>
            <div className="detail-item">
              <strong>E-Mail</strong>
              <InputText
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="itemText"
              />
            </div>
            <div className="detail-item">
              <strong>Telefone</strong>
              <InputMask
                mask="(99) 99999-9999"
                value={employee.phone}
                onChange={(e) => setEditedPhone(e.value)}
                className="itemText"
              />
            </div>
            <div className="profile-footer">
              <Button
                label="Alterar Senha"
                className="p-button-danger"
                text
                onClick={changePassword}
              />
              <Button
                label="Editar Perfil"
                className="p-button-primary"
                text
                onClick={confirmEdit}
              />
            </div>
          </div>
          <Divider layout="vertical" />
          <div className="communications p-mr-3">
            {memos.slice(0, 2).map((message, index) => (
              <Card key={index} className="communication-item">
                <h4>{message.title}</h4>
                <p>Autor: {message.author}</p>
                <p>Curso(s): {message.course.join(", ")}</p>
                <p>Turma(s): {formatClasses(message.className)}</p>
                <p>Data: {formatDate(message.data)}</p>
              </Card>
            ))}
            {memos.length > 2 && (
              <Button
                label="Ver Todos"
                className="p-button-link"
                onClick={() => setShowAllMemos(true)}
              />
            )}
          </div>
        </div>
      </Card>
      <Dialog
        header="Prévia Comunicados"
        className="dialogComs"
        visible={showAllMemos}
        onHide={() => setShowAllMemos(false)}
      >
        <div>
          {memosPaginated.map((memo, index) => (
            <Card key={index} className="communication-item">
              <h4>{memo.title}</h4>
              <p>Curso(s): {memo.course.join(", ")}</p>
              <p>Turma(s): {formatClasses(memo.className)}</p>
              <p>Data: {formatDate(memo.data)}</p>
            </Card>
          ))}
          <Paginator
            first={first}
            rows={rows}
            totalRecords={memos.length}
            onPageChange={onPageChange}
          ></Paginator>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileCard;
