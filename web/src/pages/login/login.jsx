import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Button } from "primereact/button"; 
import { Image } from 'primereact/image';
import "./login.css";

const Login = () => {
    const navigate = useNavigate();

    const [siape, setSiape] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const header = <div className="font-bold mb-3">Informe a Senha</div>;

    useEffect(() => {
        const isFormFilled =
            siape &&
            password;
        setIsFormValid(isFormFilled);
    }, [
        siape,
        password
    ]);

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

    const handleLoginButton = () => {
        navigate('/home');
    };

    const handleRegisterButton = () => {
        navigate('/register');
    };

    return (
        <div className="
            login-page
            flex
            min-h-screen
            align-items-center
            justify-content-center">
            <div className="additional-content">
                <img src="/images/login/logo-ifpr.png" alt="Logo IFPR" width="300" />
                <p>— “Mantendo os responsáveis sempre informados”</p>
                <img src="/images/login/login-background-image.png" alt="Imagem de fundo" width="500" />
            </div>
            <Card title="Login" className="
                login-container
                grid
                align-items-center
                justify-content-center
                text-center">
                <p className="sub-title font-bold">Acesse o Notify IFPR:</p>
                <div className="
                    container-grid
                    grid
                    justify-content-center">
                    <div className="
                        grid-item
                        col-12">
                        <FloatLabel className="
                            w-full
                            mb-5">
                            <InputMask
                                value={siape}
                                id="siape"
                                name="siape"
                                mask="9999999"
                                placeholder="0000000"
                                onChange={(e) => setSiape(e.target.value)}
                                onFocus={() => handleFieldFocus("SIAPE")}
                                onBlur={() => handleFieldBlur("SIAPE", siape)}
                                keyfilter="int"
                                required
                                className={`
                                    w-full 
                                    ${fieldErrors.siape ? "p-invalid" : ""}`} />
                            <label htmlFor="siape">SIAPE</label>
                        </FloatLabel>
                    </div>
                    <div className="
                        password-area
                        grid-item
                        col-12">
                        <FloatLabel className="
                            w-full
                            mb-5">
                            <Password
                                value={password}
                                id="password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => {
                                    handleFieldFocus("Senha");
                                }}
                                onBlur={() => handleFieldBlur("Senha", password)}
                                feedback={false}
                                toggleMask
                                header={header}
                                inputStyle={{ width: "100%" }}
                                className={`w-full`} />
                            <label htmlFor="password">Senha</label>
                        </FloatLabel>
                    </div>
                    <div className="
                        col-12">
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>
                    <div className="
                        grid-item
                        col-12">
                        <Button
                            label="Acessar"
                            id="login-button"
                            className={`
                                w-18rem
                                mb-4
                                ${isFormValid ? "bg-green-600 border-green-600" : "bg-gray-500 border-gray-500"}
                            `}
                            disabled={!isFormValid}
                            onClick={handleLoginButton}
                        />
                    </div>
                    <div className="
                        grid-item
                        col-4">
                        <Button
                            label="Criar Conta"
                            id="register-button"
                            className="
                                w-full
                                mb-4"
                            link
                            onMouseOver={({ target }) => target.style.color = "var(--register-button-over-color)"}
                            onMouseOut={({ target }) => target.style.color = "var(--register-button-out-color)"}
                            onClick={handleRegisterButton}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Login;
