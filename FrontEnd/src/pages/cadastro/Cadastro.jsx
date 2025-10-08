import React, { use, useState } from "react";
import * as Yup from "yup";
import style from "./Cadastro.module.scss";
import logo from "../../assets/logoCefet.svg";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";

import useUserStore from "../../store/user.js";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

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
  const { createUser, loading, error } = useUserStore();
  const { showNotification } = useNotification();
  const onNavigate = useNavigate();
  const validationSchema = Yup.object({
    nome: Yup.string().required("O nome é obrigatório."),
    email: Yup.string().email("Digite um email válido.").required("O email é obrigatório."),
    senha: Yup.string()
      .required("A senha é obrigatória.")
      .min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirm_senha: Yup.string()
      .oneOf([Yup.ref("senha"), null], "As senhas não coincidem.")
      .required("Confirme sua senha."),
  });

  // validação em tempo real
  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    try {
      await validationSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };
  function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}
const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const formToSend = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      };

      await createUser(formToSend);

      if (!error) {
        setFormData({
          nome: "",
          email: "",
          senha: "",
        });
        showNotification("Cadastro realizado com sucesso!", "success");
        onNavigate("/login");
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
        <h2 className={style.tittle_page}>Criar Conta</h2>
        <span className={style.tittle_page}>Cadastre-se no sistema</span>
      </section>

      <section className={style.section_register_bottom}>
        <div className={style.formBox}>
          <h2 className={style.sectionTitle}>Cadastro</h2>
          <form onSubmit={handleSubmit} className={style.form}>
            {/* Nome */}
            <div className={style.formGroup}>
              <label htmlFor="nome" className={style.label}>Nome*</label>
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
              <label htmlFor="email" className={style.label}>E-mail*</label>
              <Input
                id="email"
                placeholder="Escreva seu email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && <div className={style.error}>{errors.email}</div>}
            </div>

            {/* Senha */}
            <div className={style.formGroup}>
              <label htmlFor="senha" className={style.label}>Senha*</label>
              <Input
                type="password"
                id="senha"
                placeholder="Escreva sua senha"
                value={formData.senha}
                onChange={(e) => handleInputChange("senha", e.target.value)}
              />
              {errors.senha && <div className={style.error}>{errors.senha}</div>}
            </div>

            {/* Confirmar senha */}
            <div className={style.formGroup}>
              <label htmlFor="confirm_senha" className={style.label}>Confirmar senha*</label>
              <Input
                type="password"
                id="confirm_senha"
                placeholder="Confirme sua senha"
                value={formData.confirm_senha}
                onChange={(e) => handleInputChange("confirm_senha", e.target.value)}
              />
              {errors.confirm_senha && <div className={style.error}>{errors.confirm_senha}</div>}
            </div>

            {/* Botão */}
            <CustomButton
              type="submit"
              variant="default"
              size="lg"
              className={style.submitButton}
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Criar Conta"}
            </CustomButton>

            {/* Erro do backend */}
            {error && <div className={style.error}>{error}</div>}
          </form>
        </div>

        <div className={style.container_link}>
          <span>
            Já tem uma conta?{" "}
            <a href="/login" className={style.auth_link}>Faça Login</a>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Cadastro;
