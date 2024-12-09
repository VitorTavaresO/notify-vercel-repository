import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import UserService from "../../services/UserService.js";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const userService = new UserService();

  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [user, setUser] = useState({ siape: "", password: "" });

  const login = async () => {
    try {
      console.log(user);
      const response = await userService.login(user);
      if (response) {
        localStorage.setItem("user", JSON.stringify(response));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "User not found") {
          setErrorMessage("Usuário Não Encontrado");
        } else if (errorMessage === "Bad credentials") {
          setErrorMessage("Senha Inválida");
        } else {
          setErrorMessage("Error ao Logar");
        }
      } else {
        setErrorMessage("Erro com o servidor");
      }
    }
  };

  useEffect(() => {
    const isFormFilled = user.siape && user.password;
    setIsFormValid(isFormFilled);
  }, [user.siape, user.password]);

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

  const handleChange = (input) => {
    setUser({ ...user, [input.target.name]: input.target.value });
  };

  const handleRegisterButton = () => {
    navigate("/register");
  };

  const handleForgotButton = () => {
    navigate("/forgot-password");
  };

  const header = <div className="font-bold mb-3">Informe a Senha</div>;

  return (
    <div
      className="
            login-page
            flex
            min-h-screen
            min-w-screen
            align-items-center
            justify-content-center"
    >
      <div
        className="
              justify-content-end
              w-full
              h-screen
              pl-3
              -mt-8
              py-8"
      >
        <div
          className="
                additional-content-background
                justify-content-end
                w-full
                h-screen
                py-8"
        >
          <div
            className="
                    second-additional-content 
                    flex
                    flex-column
                    max-w-30rem
                    min-h-full
                    border-left-3
                    pl-3
                    -mt-8
                    justify-content-evenly"
          >
            <div
              className="
                    additional-content 
                    flex
                    flex-column
                    max-w-30rem
                    min-h-full
                    border-left-3
                    pl-5
                    -mt-8
                    justify-content-evenly"
            >
              <img
                id="first-image"
                src="/images/login/logo-ifpr.png"
                alt="Logo IFPR"
                className="
                        w-full 
                        my-5"
              />
              <p
                className="
                        my-5 text-right"
              >
                — “Mantendo os responsáveis sempre
                <br />
                informados”
              </p>
              <img
                id="second-image"
                src="/images/login/login-background-image.png"
                alt="Imagem de fundo"
                className="
                        w-full 
                        my-5"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="
                login-background
                w-full"
      >
        <Card
          title="LOGIN"
          className="
                    login-container
                    grid
                    w-full
                    max-w-30rem
                    align-items-center
                    justify-content-center
                    text-center
                    pt-5"
        >
          <p className="sub-title font-bold mb-6">Acesse o Notify IFPR:</p>
          <div
            className="
                        container-grid
                        grid
                        justify-content-center"
          >
            <div
              className="
                            grid-item
                            col-12"

            >
              <FloatLabel
                className="
                                w-full
                                mb-3
                                "
              >
                <InputMask
                  value={user.siape}
                  id="siape"
                  name="siape"
                  mask="9999999"
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus("SIAPE")}
                  onBlur={() => handleFieldBlur("SIAPE", user.siape)}
                  required
                  className={`
                                        w-full 
                                        ${fieldErrors.siape ? "p-invalid" : ""
                    }`}
                />
                <label htmlFor="siape">SIAPE</label>
              </FloatLabel>
            </div>
            <div
              className="
                            password-area
                            grid-item
                            col-12"
            >
              <FloatLabel
                className="
                                w-full
                                mb-2"
              >
                <Password
                  value={user.password}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  onFocus={() => {
                    handleFieldFocus("Senha");
                  }}
                  onBlur={() => handleFieldBlur("Senha", user.password)}
                  feedback={false}
                  toggleMask
                  header={header}
                  inputStyle={{ width: "100%" }}
                  className={`w-full`}
                />
                <label htmlFor="password">Senha</label>
              </FloatLabel>
            </div>
            <div
              className="
                            col-12"
            >
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
            <div
              className="
                            grid-item
                            max-w-16rem
                            col-12"
            >
              <Button
                rounded
                label="Acessar"
                id="login-button"
                className={`
                                    w-full
                                    mb-2
                                    ${
                                      isFormValid
                                        ? "bg-green-600 border-green-600"
                                        : "bg-gray-500 border-gray-500"
                                    }
                                `}
                disabled={!isFormValid}
                onClick={login}
              />
            </div>
            <div
              className="
                            grid-item
                            max-w-18rem
                            col-12"
            >
              <Button
                label="Criar Conta"
                id="button"
                className="
                                    w-full
                                    mb-2"
                link
                onMouseOver={({ target }) =>
                  (target.style.color = "var(--register-button-over-color)")
                }
                onMouseOut={({ target }) =>
                  (target.style.color = "var(--register-button-out-color)")
                }
                onClick={handleRegisterButton}
              />
              <Button
                label="Esqueci minha senha"
                id="button"
                className="
                                    w-full
                                    mb-2"
                link
                onMouseOver={({ target }) =>
                  (target.style.color = "var(--register-button-over-color)")
                }
                onMouseOut={({ target }) =>
                  (target.style.color = "var(--register-button-out-color)")
                }
                onClick={handleForgotButton}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;