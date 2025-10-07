import React, { useState, useEffect } from "react";
import style from "./Login.module.scss";
import logo from "../../assets/logoCefet.svg";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";
import TextField from "@mui/material/TextField";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Usuário logado!");
      setFormData({
        email: "",
        senha: "",
      });
    }, 1500);
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
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
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
