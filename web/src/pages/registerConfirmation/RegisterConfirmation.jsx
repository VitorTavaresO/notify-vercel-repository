import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";

const RegisterConfirmation = () => {
  const { email, code } = useParams();
  const navigate = useNavigate();
  const userService = new UserService();

  const validateEmail = async () => {
    try {
      const response = await userService.emailValidation(email, code);
      if (response) {
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    validateEmail();
  }, [email, code, navigate, userService]);

  return (
    <div className="h-screen flex align-items-center justify-content-center bg-gray-800">
      <div className="card">
        <h1>Register Confirmation</h1>
        <h2>
          Email validated successfully! You will be redirected to the login
          screen in 5 seconds.
        </h2>
      </div>
    </div>
  );
};

export default RegisterConfirmation;
