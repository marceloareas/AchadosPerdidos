import React, { useState, useEffect } from "react";
import style from "./Login.module.scss";
import logo from "../../assets/logoCefet.svg";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";
import { useNotification } from "../../utils/NotificationContext.jsx";
import { loginSchema } from "../../validation/validation";
import useAuthStore from "../../store/auth.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const onNavigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { login } = useAuthStore();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    try {
      loginSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const formToSend = {
        email: formData.email,
        senha: formData.senha,
      };
      await login(formToSend);
      const { erro, response } = useAuthStore.getState();
      if (!erro) {
        setFormData({
          email: "",
          senha: "",
        });
        showNotification("Login realizado com sucesso!", "success");
        setTimeout(() => {
          setIsLoading(false);
          onNavigate("/");
        }, 1500);
      } else {
        showNotification(response, "error");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };
  return (
    <div className={style.pageContainer}>
      <section className={style.section_register_top}>
        <img className={style.logo_marca} src={logo} alt="" />
        <h3 className={style.logo_name}>A&P</h3>
        <h2 className={style.tittle_page}>Bem vindo!</h2>
        <span className={style.tittle_page}>Entre em sua conta</span>
      </section>
      <section className={style.section_register_bottom}>
        <div className={style.formBox}>
          <h2 className={style.sectionTitle}>Entrar</h2>

          <form onSubmit={handleSubmit} className={style.form}>
            {/* Email */}
            <div className={style.formGroup}>
              <label htmlFor="email" className={style.label}>
                Email *
              </label>
              <Input
                id="email"
                placeholder="Escreva seu email"
                // value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              {errors.nome && <div className={style.error}>{errors.nome}</div>}
            </div>

            {/* Senha */}
            <div className={style.formGroup}>
              <label htmlFor="senha" className={style.label}>
                Senha*
              </label>
              <Input
                type="password"
                id="senha"
                placeholder="Escreva sua senha"
                // value={formData.senha}
                onChange={(e) => handleInputChange("senha", e.target.value)}
                required
              />
              {errors.nome && <div className={style.error}>{errors.senha}</div>}
            </div>

            {/* Submit */}
            <CustomButton
              type="submit"
              variant="default"
              size="lg"
              className={style.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </CustomButton>
          </form>
        </div>
        <div className={style.container_link}>
          <span>
            {" "}
            Não tem uma conta?{" "}
            <a href="/register" className={style.auth_link}>
              Cadastre-se
            </a>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Login;
