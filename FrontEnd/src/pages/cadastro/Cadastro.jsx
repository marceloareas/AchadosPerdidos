import React, { useState, useEffect } from "react";
import style from "./Cadastro.module.scss";
import logo from "../../assets/logoCefet.svg";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
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
      alert("Usuário cadastrado!");
      setFormData({
        nome: "",
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
        <h2 className={style.tittle_page}>Criar Conta</h2>
        <span className={style.tittle_page}>Cadastre-se no sistema</span>
      </section>
      <section className={style.section_register_bottom}>
        <div className={style.formBox}>
          <h2 className={style.sectionTitle}>Cadastro</h2>

          <form onSubmit={handleSubmit} className={style.form}>
            {/* Nome */}
            <div className={style.formGroup}>
              <label htmlFor="nome" className={style.label}>
                Nome*
              </label>
              <Input
                id="nome"
                placeholder="escreva seu nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className={style.formGroup}>
              <label htmlFor="email" className={style.label}>
                Local *
              </label>
              <Input
                id="email"
                placeholder="Escreva seu email"
                value={formData.email}
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
                value={formData.senha}
                onChange={(e) => handleInputChange("senha", e.target.value)}
                required
              />
            </div>

            {/* Cor */}
            <div className={style.formGroup}>
              <label htmlFor="confirm_senha" className={style.label}>
                Confirmar senha*
              </label>
              <Input
                type="password"
                id="confirm_senha"
                placeholder="Confirme sua senha"
                onChange={(e) => handleInputChange("senha", e.target.value)}
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
              {isLoading ? "Cadastrando..." : "Criar Conta"}
            </CustomButton>
          </form>
        </div>
        <div className={style.container_link}>
          <span>
            {" "}
            Já tem uma conta?{" "}
            <a href="/login" className={style.auth_link}>
              Faça Login
            </a>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Cadastro;
