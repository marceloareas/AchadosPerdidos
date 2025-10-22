import React, { use, useState } from "react";
import style from "./Cadastro.module.scss";
import logo from "../../assets/logoCefet.svg";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";

import useAuthStore from "../../store/auth.js";
import { registerSchema } from "../../validation/validation.jsx";

import { useNavigate } from "react-router-dom";
import { useNotification } from "../../utils/NotificationContext.jsx";

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    // confirm_senha: "",
  });
  const [errors, setErrors] = useState({});
  const { register } = useAuthStore();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const onNavigate = useNavigate();

  // validação em tempo real
  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    try {
      await registerSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const formToSend = {
        nome: formData.nome,
        email: formData.email,
      };

      await register(formToSend);
      const { erro, response } = useAuthStore.getState();
      if (!erro) {
        setFormData({
          nome: "",
          email: "",
          senha: "",
        });
        showNotification("Cadastro realizado com sucesso!", "success");
        setTimeout(() => {
          onNavigate("/login");
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
        setIsLoading(false);
      }
    }
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
              />
              {errors.nome && <div className={style.error}>{errors.nome}</div>}
            </div>

            {/* Email */}
            <div className={style.formGroup}>
              <label htmlFor="email" className={style.label}>
                E-mail*
              </label>
              <Input
                id="email"
                placeholder="Escreva seu email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && (
                <div className={style.error}>{errors.email}</div>
              )}
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
              />
              {errors.senha && (
                <div className={style.error}>{errors.senha}</div>
              )}
            </div>

            {/* Confirmar senha */}
            <div className={style.formGroup}>
              <label htmlFor="confirm_senha" className={style.label}>
                Confirmar senha*
              </label>
              <Input
                type="password"
                id="confirm_senha"
                placeholder="Confirme sua senha"
                value={formData.confirm_senha}
                onChange={(e) =>
                  handleInputChange("confirm_senha", e.target.value)
                }
              />
              {errors.confirm_senha && (
                <div className={style.error}>{errors.confirm_senha}</div>
              )}
            </div>

            {/* Botão */}
            <CustomButton
              type="submit"
              variant="default"
              size="lg"
              className={style.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Criar Conta"}
            </CustomButton>

            {/* Erro do backend */}
            {/* {errors && <div className={style.error}>{errors}</div>} */}
          </form>
        </div>

        <div className={style.container_link}>
          <span>
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
