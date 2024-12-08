import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { InputOtp } from 'primereact/inputotp';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

import EmailValidation from "web/src/validation/EmailValidation.js";

import './ForgotPassword.css';
import UserService from "../../services/UserService";

const ForgotPassword = () => {

    const [currentSection, setCurrentSection] = useState(1);

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const userService = new UserService;

    const [user, setUser] = useState({ email: "", password: "" });

    const [isFormValid1, setIsFormValid1] = useState(false);
    const [isFormValid2, setIsFormValid2] = useState(false);
    const [isFormValid3, setIsFormValid3] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const header = <div className="font-bold mb-3">Informe a Senha</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Obrigatório:</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li
                    className={
                        passwordCriteria.hasLowerCase ? "text-green-500" : "text-red-500"
                    }
                >
                    Ao menos uma letra minúscula
                </li>
                <li
                    className={
                        passwordCriteria.hasUpperCase ? "text-green-500" : "text-red-500"
                    }
                >
                    Ao menos uma letra maiúscula
                </li>
                <li
                    className={
                        passwordCriteria.hasNumber ? "text-green-500" : "text-red-500"
                    }
                >
                    Ao menos um número
                </li>
                <li
                    className={
                        passwordCriteria.hasSpecialChar ? "text-green-500" : "text-red-500"
                    }
                >
                    Ao menos um caractere especial
                </li>
                <li
                    className={
                        passwordCriteria.minLength ? "text-green-500" : "text-red-500"
                    }
                >
                    Mínimo de 6 caracteres
                </li>
            </ul>

        </>
    );

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setUser((prevUser) => ({ ...prevUser, email: newEmail }));
        setIsEmailValid(EmailValidation(newEmail));
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        setPasswordCriteria({
            minLength: password.length >= 6,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-\\]/.test(password), // O '\\' é necessario para não ficar como palavra reservada.
        });
    };

    const handlePasswordConfirmation = (e) => {
        const confirmPassword = e.target.value;
        setConfirmPassword(confirmPassword);
        if (password !== confirmPassword) {
            setErrorMessage("As senhas devem ser iguais.");
        } else {
            setErrorMessage("");
        }
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

    const handleNext = async () => {
        
        if(currentSection == 1){
            try{
                const response = await userService.recoverSendEmail(email);
                if(response){ setCurrentSection(prevSection => prevSection + 1);}
            }
            catch(error){ setErrorMessage("Erro ao enviar o código para o Email");}
        };

        if(currentSection == 2){
            try{
                const response = await userService.recoverVerifyCode(otp);
                if(response){ setCurrentSection(prevSection => prevSection + 1);}
            }
            catch(error){ setErrorMessage("Código Inválido");}
        }

        if(currentSection == 3){
            try{
                const response = await userService.recoverChangePassword({email, password});
                if(response){ navigate("/login")}
            }
            catch(error){ setErrorMessage("Erro ao alterar a Senha"); console.log(error) }
        }
    }

    const handleBack = () => {
        setCurrentSection(prevSection => prevSection - 1);
    };

    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const isFormFilled1 = !!user.email && isEmailValid;
        setIsFormValid1(isFormFilled1);

        const isFormFilled2 = otp.length === 5;
        setIsFormValid2(isFormFilled2);

        if (currentSection === 2) {
            const interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(prevSeconds => prevSeconds - 1);
                } else if (minutes > 0) {
                    setMinutes(prevMinutes => prevMinutes - 1);
                    setSeconds(59);
                }
            }, 1000);

            return () => clearInterval(interval);
        }

        const isPasswordsEqual = password === confirmPassword;
        const arePasswordCriteriaMet = Object.values(passwordCriteria).every(Boolean);
        setIsFormValid3(isPasswordsEqual && arePasswordCriteriaMet);

    }, [user.email, isEmailValid,
        minutes, seconds, currentSection,
        [otp],
        [password, confirmPassword, passwordCriteria]]);

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
                            <img id="forgot-image-one" className="mt-8"
                                src={currentSection === 3 ? "/images/forgot/forgot-image-two.png" : "/images/forgot/forgot-image-one.png"}/>
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
                            <Button label="Enviar Código" id="login-button" disabled={!isFormValid1} onClick={handleNext} rounded 
                                className={`w-full mb-2 ${isFormValid1 ? "bg-green-600 border-green-600" : "bg-gray-500 border-gray-500"}`}
                                onMouseOver={({ target }) =>(target.style.color = "var(--register-button-over-color)")}
                                onMouseOut={({ target }) => (target.style.color = "var(--register-button-out-color)")}/>

                            <Link to="/login"><Button label="Voltar" onClick={handleBack} link className="back-btn mt-3 -mb-4"/></Link>
                        </div>
                    </div>
                    )}

                    {currentSection === 2 && (
                    <div>
                        <p className="sub-title font-bold -mt-3 mb-3">Acesse ao Notify IFPR:</p>
                        <div className="container-grid grid justify-content-center">
                            <div className="grid-item col-12">

                                <p className="mt-3 mb-5 timer-input font-bold">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>

                                <p>Informe o código enviado para</p>
                                <p className="-mt-2 email-input font-bold">{email}</p>

                                <div className="mt-5 mb-6 flex flex-column align-items-center">
                                    <InputOtp length={5} value={otp} onChange={(e) => handleOtpChange(e.value)}
                                        style={{ pointerEvents: "auto", zIndex: 10}}/>
                                </div>

                            </div>
                        </div>
                        <div className="grid-item max-w-16rem col-12" style={{ marginLeft: "12px" }}>
                            <Button label="Próximo" id="login-button" disabled={!isFormValid2} onClick={handleNext} rounded 
                                className={`w-full mb-2 ${isFormValid2 ? "bg-green-600 border-green-600" : "bg-gray-500 border-gray-500"}`}
                                onMouseOver={({ target }) =>(target.style.color = "var(--register-button-over-color)")}
                                onMouseOut={({ target }) => (target.style.color = "var(--register-button-out-color)")}/>

                            <Button label="Voltar" onClick={handleBack} link className="back-btn mt-3 -mb-4"/>
                        </div>
                    </div>
                    )}

                    {currentSection === 3 && (
                    <div>
                        <p className="sub-title font-bold -mt-3 mb-8">Acesse ao Notify IFPR:</p>
                        <div className="container-grid grid justify-content-center">
                        <div className="
                        password-area
                        grid-item
                        col-12">
                            <FloatLabel className="
                            w-full
                            mb-3">
                                <Password
                                    value={password}
                                    id="password"
                                    name="password"
                                    onChange={handlePasswordChange}
                                    onFocus={() => {
                                        handleFieldFocus("Senha");
                                        setIsPasswordFocused(true);
                                    }}
                                    onBlur={() => handleFieldBlur("Senha", password)}
                                    inputStyle={{ width: "100%" }}
                                    toggleMask
                                    header={header}
                                    footer={footer}
                                    invalid={
                                        isPasswordFocused &&
                                        !Object.values(passwordCriteria).every(Boolean)
                                    }
                                    className={`
                                    w-full
                                    ${fieldErrors.password ? "p-invalid" : ""}`} />
                                <label htmlFor="password">Senha</label>
                            </FloatLabel>
                        </div>
                        <div className="
                        grid-item
                        col-12">
                            <FloatLabel className="
                            password-area
                            w-full
                            mb-3">
                                <Password
                                    value={confirmPassword}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChange={handlePasswordConfirmation}
                                    onFocus={() => handleFieldFocus("Confirme a Senha")}
                                    onBlur={() =>
                                        handleFieldBlur("Confirme a Senha", confirmPassword)
                                    }
                                    inputStyle={{ width: "100%" }}
                                    toggleMask
                                    feedback={false}
                                    required
                                    className={`
                                    w-full
                                    ${fieldErrors.confirmPassword ? "p-invalid" : ""}`} />
                                <label htmlFor="confirmPassword">Confirme a Senha</label>
                            </FloatLabel>
                        </div>
                        </div>
                        <div className="grid-item max-w-16rem col-12" style={{ marginLeft: "87px" }}>
                            <Button label="Redefinir Senha" id="login-button" disabled={!isFormValid3} onClick={handleNext} rounded 
                                className={`w-full mb-2 ${isFormValid3 ? "bg-green-600 border-green-600" : "bg-gray-500 border-gray-500"}`}
                                onMouseOver={({ target }) =>(target.style.color = "var(--register-button-over-color)")}
                                onMouseOut={({ target }) => (target.style.color = "var(--register-button-out-color)")}/>

                            <Link to="/login"><Button label="Voltar" onClick={handleBack} link className="back-btn mt-3 -mb-4"/></Link>
                        </div>
                    </div>
                    )}

                </Card>
            </div>
        </div>
    </>
    );
}; export default ForgotPassword;