import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import CpfValidation from "../../validation/CpfValidation";
import EmailValidation from "../../validation/EmailValidation";
import UserService from "../../services/UserService";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [siape, setSiape] = useState("");
  const [position, setPosition] = useState("");
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isCpfValid, setIsCpfValid] = useState(false);
  const [isCpfFocused, setIsCpfFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  useEffect(() => {
    const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
    const isFormFilled =
      name &&
      cpf &&
      siape &&
      position &&
      email &&
      phone &&
      password &&
      confirmPassword &&
      isPasswordValid &&
      password === confirmPassword;
    setIsFormValid(isFormFilled);
  }, [
    name,
    cpf,
    siape,
    email,
    phone,
    password,
    confirmPassword,
    passwordCriteria,
  ]);

  const handleRegister = () => {
    setIsRegistering(true);
    const formattedCpf = cpf.replace(/[^\d]/g, "");

    const userService = new UserService();
    userService
      .register({
        name: name,
        cpf: formattedCpf,
        siape: siape,
        position: position,
        email: email,
        phone: phone,
        password: password,
        role: "UNDEFINED", // Adicione o campo role com valor padrão
      })
      .then((data) => {
        console.log("Usuário cadastrado com sucesso:", data);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar usuário:", error.message);
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsRegistering(false);
      });
  };

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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordCriteria({
      minLength: newPassword.length >= 6,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-\\]/.test(newPassword), // O '\\' é necessario para não ficar como palavra reservada.
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

  const handleCpfChange = (e) => {
    const newCpf = e.target.value;
    setCpf(newCpf);
    setIsCpfValid(CpfValidation(newCpf));
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
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

  return (
    <div
      className="
        register
        flex
        min-h-screen
        min-w-screen
        align-items-stretch
        justify-content-center"
    >
      <div
        className="
            justify-content-end
            w-full
            h-full
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
                                pt-8
                                pl-5"
              />
              <p
                className="
                            my-5 pl-5 text-right"
              >
                — “Mantendo os responsáveis sempre
                <br />
                informados”
              </p>
              <img
                id="second-image"
                src="/images/register/register-image-one.png"
                alt="Imagem de fundo"
                className="
                            w-full
                            pl-5"
              />
              <img
                id="third-image"
                src="/images/register/register-image-two.png"
                alt="Imagem de fundo"
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
          title="Registro"
          className="
            register-container
            grid
            align-items-center
            justify-content-center
            text-center"
        >
          <p className="sub-title font-bold">Ingresse no Notify IFPR:</p>
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
                        mb-3"
              >
                <InputText
                  value={name}
                  id="name"
                  name="name"
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleFieldFocus("Nome")}
                  onBlur={() => handleFieldBlur("Nome", name)}
                  required
                  className={`
                                w-full ${fieldErrors.name ? "p-invalid" : ""}`}
                />
                <label htmlFor="name">Nome</label>
              </FloatLabel>
            </div>
            <div
              className="
                    grid-item
                    col-12"
            >
              <FloatLabel
                className="
                        w-full
                        mb-3"
              >
                <InputMask
                  value={cpf}
                  id="cpf"
                  name="cpf"
                  mask="999.999.999-99"
                  onChange={handleCpfChange}
                  onFocus={() => {
                    handleFieldFocus("CPF");
                    setIsCpfFocused(true);
                  }}
                  onBlur={() => handleFieldBlur("CPF", cpf)}
                  keyfilter="int"
                  required
                  invalid={isCpfFocused && !isCpfValid}
                  className={`
                                w-full
                                ${fieldErrors.cpf ? "p-invalid" : ""}`}
                />
                <label htmlFor="cpf">CPF</label>
              </FloatLabel>
            </div>
            <div
              className="
                    grid-item
                    col-12"
            >
              <FloatLabel
                className="
                        w-full
                        mb-3"
              >
                <InputMask
                  value={siape}
                  id="siape"
                  name="siape"
                  mask="9999999"
                  onChange={(e) => setSiape(e.target.value)}
                  onFocus={() => handleFieldFocus("SIAPE")}
                  onBlur={() => handleFieldBlur("SIAPE", siape)}
                  keyfilter="int"
                  required
                  className={`
                                w-full ${fieldErrors.phone ? "p-invalid" : ""}`}
                />
                <label htmlFor="siape">SIAPE</label>
              </FloatLabel>
            </div>
            <div
              className="
                    grid-item
                    col-12"
            >
              <FloatLabel
                className="
                        w-full
                        mb-3"
              >
                <InputMask
                  value={phone}
                  id="phone"
                  name="phone"
                  autoComplete="phone"
                  mask="(99) 99999-9999"
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => handleFieldFocus("Telefone")}
                  onBlur={() => handleFieldBlur("Telefone", phone)}
                  keyfilter="int"
                  required
                  className={`
                                w-full ${fieldErrors.phone ? "p-invalid" : ""}`}
                />
                <label htmlFor="phone">Telefone</label>
              </FloatLabel>
            </div>
            <div
              className="
                    grid-item
                    col-12"
            >
              <FloatLabel
                className="
                        w-full
                        mb-3"
              >
                <InputText
                  value={position}
                  id="position"
                  name="position"
                  onChange={(e) => setPosition(e.target.value)}
                  onFocus={() => handleFieldFocus("Cargo")}
                  onBlur={() => handleFieldBlur("Cargo", position)}
                  required
                  className={`
                                w-full ${
                                  fieldErrors.position ? "p-invalid" : ""
                                }`}
                />
                <label htmlFor="position">Cargo</label>
              </FloatLabel>
            </div>
            <div
              className="
                    grid-item
                    col-12"
            >
              <FloatLabel
                className="
                        w-full
                        mb-3"
              >
                <InputText
                  value={email}
                  id="email"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  onFocus={() => {
                    handleFieldFocus("Email");
                    setIsEmailFocused(true);
                  }}
                  onBlur={() => handleFieldBlur("Email", email)}
                  keyfilter="email"
                  required
                  invalid={isEmailFocused && !isEmailValid}
                  className={`
                                w-full ${fieldErrors.email ? "p-invalid" : ""}`}
                />
                <label htmlFor="email">Email</label>
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
                        mb-3"
              >
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
                                ${fieldErrors.password ? "p-invalid" : ""}`}
                />
                <label htmlFor="password">Senha</label>
              </FloatLabel>
            </div>
            <div
              className="
                    grid-item
                    col-12"
            >
              <FloatLabel
                className="
                        password-area
                        w-full
                        mb-3"
              >
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
                                ${
                                  fieldErrors.confirmPassword ? "p-invalid" : ""
                                }`}
                />
                <label htmlFor="confirmPassword">Confirme a Senha</label>
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
                    col-12"
            >
              <Button
                label="Criar Conta"
                id="register-button"
                className={`
                            w-18rem
                            mb-2
                            ${
                              isFormValid
                                ? "bg-green-600 border-green-600"
                                : "bg-gray-500 border-gray-500"
                            }
                        `}
                disabled={!isFormValid || isRegistering}
                onClick={handleRegister}
              />
            </div>
            <div
              className="
                    grid-item
                    col-4"
            >
              <Button
                label="Voltar"
                id="back-button"
                className="
                            w-full
                            mb-2"
                link
                onMouseOver={({ target }) =>
                  (target.style.color = "var(--back-button-over-color)")
                }
                onMouseOut={({ target }) =>
                  (target.style.color = "var(--back-button-out-color)")
                }
                onClick={handleGoBack}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;