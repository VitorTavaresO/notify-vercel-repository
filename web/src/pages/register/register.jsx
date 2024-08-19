import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import "./register.css";

const Register = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const [firstName, setFirstName] = useState("");
    const [cpf, setCpf] = useState("");
    const [siape, setSiape] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    useEffect(() => {
        const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
        const isFormFilled =
            firstName &&
            cpf &&
            siape &&
            email &&
            phone &&
            password &&
            confirmPassword &&
            isPasswordValid &&
            password === confirmPassword;
        setIsFormValid(isFormFilled);
    }, [
        firstName,
        cpf,
        siape,
        email,
        phone,
        password,
        confirmPassword,
        passwordCriteria,
    ]);

    const header = <div className="font-bold mb-3">Chose a Password</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Required</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li
                    className={
                        passwordCriteria.hasLowerCase ? "text-green-500" : "text-red-500"
                    }
                >
                    At least one lowercase
                </li>
                <li
                    className={
                        passwordCriteria.hasUpperCase ? "text-green-500" : "text-red-500"
                    }
                >
                    At least one uppercase
                </li>
                <li
                    className={
                        passwordCriteria.hasNumber ? "text-green-500" : "text-red-500"
                    }
                >
                    At least one numeric
                </li>
                <li
                    className={
                        passwordCriteria.hasSpecialChar ? "text-green-500" : "text-red-500"
                    }
                >
                    At least one special character
                </li>
                <li
                    className={
                        passwordCriteria.minLength ? "text-green-500" : "text-red-500"
                    }
                >
                    Minimum 6 characters
                </li>
            </ul>
        </>
    );

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordCriteria({
            minLength: newPassword.length >= 6,
            hasUpperCase: /[A-Z]/.test(newPassword),
            hasLowerCase: /[a-z]/.test(newPassword),
            hasNumber: /[0-9]/.test(newPassword),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        });
    };

    const handlePasswordConfirmation = (e) => {
        const confirmPassword = e.target.value;
        setConfirmPassword(confirmPassword);
        if (password !== confirmPassword) {
            setErrorMessage("Passwords must match.");
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

    return (
        <div className="register flex align-items-center justify-content-center">
            <Card title="Registro" className="m-2 container-register grid align-items-center justify-content-center text-center">
                <div className="grid justify-content-center">
                    <div className="sm:col-9 col-1">
                        <FloatLabel className="w-full mb-5">
                            <InputText
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                onFocus={() => handleFieldFocus("Nome")}
                                onBlur={() => handleFieldBlur("Nome", firstName)}
                                required
                                className={`w-full ${fieldErrors.firstName ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="first-name">Nome</label>
                        </FloatLabel>
                    </div>
                    <div className="sm:col-9 col-1">
                        <FloatLabel className="w-full mb-5">
                            <InputMask
                                value={cpf}
                                mask="(99) 99999-9999"
                                onChange={(e) => setPhone(e.target.value)}
                                onFocus={() => handleFieldFocus("CPF")}
                                onBlur={() => handleFieldBlur("CPF", cpf)}
                                keyfilter="int"
                                required
                                className={`w-full ${fieldErrors.phone ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="cpf">CPF</label>
                        </FloatLabel>
                    </div>
                    <div className="sm:col-9 col-1">
                        <FloatLabel className="w-full mb-5">
                            <InputMask
                                value={phone}
                                mask="(99) 99999-9999"
                                onChange={(e) => setPhone(e.target.value)}
                                onFocus={() => handleFieldFocus("Telefone")}
                                onBlur={() => handleFieldBlur("Telefone", phone)}
                                keyfilter="int"
                                required
                                className={`w-full ${fieldErrors.phone ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="phone">Telefone</label>
                        </FloatLabel>
                    </div>
                    <div className="sm:col-9 col-1">
                        <FloatLabel className="w-full mb-5">
                            <InputText
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => handleFieldFocus("Email")}
                                onBlur={() => handleFieldBlur("Email", email)}
                                keyfilter="email"
                                required
                                className={`w-full ${fieldErrors.email ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="email">Email</label>
                        </FloatLabel>
                    </div>
                    <div className="sm:col-9 col-1">
                        <FloatLabel className="w-full mb-5">
                            <Password
                                inputStyle={{ width: "100%" }}
                                toggleMask
                                value={password}
                                onChange={handlePasswordChange}
                                onFocus={() => {
                                    handleFieldFocus("Senha");
                                    setIsPasswordFocused(true);
                                }}
                                onBlur={() => handleFieldBlur("Senha", password)}
                                header={header}
                                footer={footer}
                                invalid={
                                    isPasswordFocused &&
                                    !Object.values(passwordCriteria).every(Boolean)
                                }
                                className={`w-full ${fieldErrors.password ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="password">Senha</label>
                        </FloatLabel>
                    </div>
                    <div className="sm:col-9 col-1">
                        <FloatLabel className="w-full mb-5">
                            <Password
                                inputStyle={{ width: "100%" }}
                                toggleMask
                                value={confirmPassword}
                                onChange={handlePasswordConfirmation}
                                onFocus={() => handleFieldFocus("Confirme a Senha")}
                                onBlur={() =>
                                    handleFieldBlur("Confirme a Senha", confirmPassword)
                                }
                                feedback={false}
                                required
                                className={`w-full ${fieldErrors.confirmPassword ? "p-invalid" : ""
                                    }`}
                            />
                            <label htmlFor="confirm-password">Confirme a Senha</label>
                        </FloatLabel>
                    </div>
                    <div className="col-12">
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>
                    <div className="sm:col-9 col-1">
                        <Button
                            label="Voltar"
                            className="mb-3 w-full bg-red-500 border-red-500"
                            onClick={handleGoBack}
                        />
                    </div>
                    <div className="sm:col-9 col-1">
                        <Button
                            label="Criar Conta"
                            className={`mb-4 w-full ${isFormValid
                                    ? "bg-green-500 border-green-500"
                                    : "bg-gray-500 border-gray-500"
                                }`}
                            disabled={!isFormValid}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Register;
