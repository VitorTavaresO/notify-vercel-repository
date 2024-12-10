import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import Footer from "../../components/footer/Footer";

const RegisterConfirmation = () => {
  const { email, code } = useParams();
  const navigate = useNavigate();
  const userService = new UserService();
  const [counter, setCounter] = useState(5);
  const [validationMessage, setValidationMessage] = useState("");

  const validateEmail = async () => {
    try {
      const response = await userService.emailCodeValidation(email, code);
      const message = typeof response.data === 'string' ? response.data : response.data.message;
      if (message === "Email validated successfully!") {
        setValidationMessage(message);
        const interval = setInterval(() => {
          setCounter((prevCounter) => {
            if (prevCounter <= 1) {
              clearInterval(interval);
              navigate("/login");
            }
            return prevCounter - 1;
          });
        }, 1000);
      } else {
        setValidationMessage(message);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message;
        setValidationMessage(errorMessage);
      } else {
        setValidationMessage("An error occurred during validation.");
      }
    }
  };

  useEffect(() => {
    validateEmail();
  }, [email, code]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#FFFFFF",
            borderRadius: "7px",
            border: `solid 2px ${validationMessage === "Email validated successfully!" ? "#2F9E41" : "#FF0000"}`,
          }}
        >
          <h1 style={{ color: validationMessage === "Email validated successfully!" ? "#2F9E41" : "#FF0000" }}>
            Register Confirmation
          </h1>
          <h2 style={{ color: "#242424" }}>{validationMessage}</h2>
          {validationMessage === "Email validated successfully!" && (
            <p style={{ color: "#666666" }}>
              You will be redirected to the login screen in {counter} seconds.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterConfirmation;
