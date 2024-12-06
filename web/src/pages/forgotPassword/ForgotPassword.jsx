import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

import EmailValidation from "../../validation/emailValidation";

import './ForgotPassword.css';

const ForgotPassword = () => {

    const [currentSection, setCurrentSection] = useState(1);

    const [email, setEmail] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);

    const [user, setUser] = useState({ email: "", newPassword: "" });

    const [isFormValid, setIsFormValid] = useState(false);

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setUser((prevUser) => ({ ...prevUser, email: newEmail }));
        setIsEmailValid(EmailValidation(newEmail));
    };

    const handleFieldFocus = (field) => {
        setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [field]: false,
        }));
    };

    const handleFieldBlur = (field, value) => {
        if (!value) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                [field]: true,
            }));
        }
    };

    const handleNext = () => {
        setCurrentSection(prevSection => prevSection + 1);
    };

    useEffect(() => {
        const isFormFilled = !!user.email && isEmailValid;
        setIsFormValid(isFormFilled);
    }, [user.email, isEmailValid]);

    return (
        <>
        <Helmet>
            <title>Recuperar Senha</title>
        </Helmet>
        <div className="login-page flex min-h-screen min-w-screen align-items-center justify-content-center"> 
            <div className="justify-content-end w-full h-screen pl-3 -mt-8 py-8">
                <div className="additional-content-background justify-content-end w-full h-screen py-8">
                    <div className="second-additional-content  flex flex-column max-w-30rem min-h-full border-left-3 pl-3 -mt-8 justify-content-evenly">
                        <div className="additional-content flex flex-column max-w-30rem min-h-full border-left-3 pl-5 -mt-8 justify-content-evenly">
                            <img id="first-image" src="/images/login/logo-ifpr.png" alt="Logo IFPR" className="w-full mt-7 -mb-5"/>
                            <p className="mt-8 mb-5 -mr-3 text-right primary-text">—  “Mantendo os responsáveis sempre<br/>informados”</p>
                            <img id="forgot-image-one" src="/images/forgot/forgot-image-one.png" alt="Imagem de fundo" className="mt-8"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="login-background w-full">
                <Card title="REDEFINIR SENHA" className="login-container grid w-full max-w-30rem align-items-center justify-content-center text-center pt-5">
                    
                    {currentSection === 1 && (
                    <div>
                        <p className="sub-title font-bold -mt-3 mb-8">Acesse ao Notify IFPR:</p>
                        <div className="container-grid grid justify-content-center">
                            <div className="grid-item col-12">
                                <FloatLabel className="w-full mb-3">
                                    <InputText value={email} id="email" name="email" autoComplete="email"
                                        onChange={handleEmailChange}
                                        onFocus={() => { handleFieldFocus("Email"); setIsEmailFocused(true);}}
                                        onBlur={() => handleFieldBlur("Email", email)}
                                        keyfilter="email" required
                                        invalid={isEmailFocused && !isEmailValid}
                                        style={{ width: "430px" }}
                                        className={`${fieldErrors.email ? "p-invalid" : ""}`} />
                                    <label htmlFor="siape">Email</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="grid-item max-w-16rem col-12" style={{ marginLeft: "87px" }}>
                            <Button label="Enviar Código" id="login-button" disabled={!isFormValid} onClick={handleNext} rounded 
                                className={`w-full mb-2 ${isFormValid ? "bg-green-600 border-green-600" : "bg-gray-500 border-gray-500"}`}
                                onMouseOver={({ target }) =>(target.style.color = "var(--register-button-over-color)")}
                                onMouseOut={({ target }) => (target.style.color = "var(--register-button-out-color)")}/>
                        </div>
                    </div>
                    )}

                </Card>
            </div>
        </div>
    </>
    );
}; export default ForgotPassword;