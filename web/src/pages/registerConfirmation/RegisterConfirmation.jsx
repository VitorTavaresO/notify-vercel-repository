import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import Footer from "../../components/footer/Footer";

const RegisterConfirmation = () => {
  const { email, code } = useParams();
  const navigate = useNavigate();
  const userService = new UserService();
  const [counter, setCounter] = useState(5);

  const validateEmail = async () => {
    try {
      const response = await userService.emailValidation(email, code);
      if (response) {
        const interval = setInterval(() => {
          setCounter((prevCounter) => {
            if (prevCounter <= 1) {
              clearInterval(interval);
              navigate("/login");
            }
            return prevCounter - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    validateEmail();
  }, [email, code, navigate, userService]);

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
            border: "solid 2px #2F9E41",
          }}
        >
          <h1 style={{ color: "#2F9E41" }}>Register Confirmation</h1>
          <h2 style={{ color: "#242424" }}>Email validated successfully!</h2>
          <p style={{ color: "#666666" }}>
            You will be redirected to the login screen in {counter} seconds.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterConfirmation;
