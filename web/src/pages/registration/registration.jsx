import React, { useState } from "react";
import "./registration.css";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Registration = () => {
    return (
        <div className="card-container">
            <Card title="Registration" className="card">
                <InputText placeholder="Nome Completo" />
                <InputText placeholder="Cargo" />
                <InputText placeholder="CPF" />
                <InputText placeholder="SIAPE" />
                <InputText placeholder="Email" />
                <InputText placeholder="Telefone" />
                <Button label="Submit" />
            </Card>
        </div>
    );
}
export default Registration;

//nome cpf cargo SIAPE EMAIL E TELEFONE