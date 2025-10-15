import React, { useState, useEffect } from "react";
import style from "./Profile.module.scss";
import Footer from "../../components/footer/Footer";
import { BiSolidUserCircle } from "react-icons/bi";
import { IoReturnUpBackOutline } from "react-icons/io5";
import InputUpdate from "../../components/ui/inputUpdate/InputUpdate";
import CustomButton from "../../components/ui/button/CustomButton.jsx";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../utils/NotificationContext.jsx";
import { registerSchema } from "../../validation/validation";
import useUserStore from "../../store/user.js";

const Profile = () => {
  const { user } = useUserStore();
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    senha: "",
    confirm_senha: ""
  });
  const onNavigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nome: user.nome,
        email: user.email
      }));
    }
  }, [user]);

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
    
  };

  return (
    <>
      <div className={style.pageContainer}>
        <main className={style.pageMain}>
          <section className={style.top_section}>
            <IoReturnUpBackOutline
              className={style.back_home}
              size={50}
              onClick={() => onNavigate("/")}
            />
          </section>
          <section className={style.mid_section}>
            <h1 className={style.title}>Olá, {user?.nome}</h1>
            <h3 className={style.subtitle}>Visualize seus dados abaixo.</h3>
            <BiSolidUserCircle className={style.svgProfile} size={150} />
          </section>
          <section className={style.bottom_section}>
            <form onSubmit={handleSubmit} className={style.form}>
              <div>
                <label htmlFor="nome" className={style.label}>
                  Nome *
                </label>
                <InputUpdate
                  id="nome"
                  placeholder="Escreva seu nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="email" className={style.label}>
                  E-mail*
                </label>
                <InputUpdate
                  id="email"
                  placeholder="Escreva seu email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <div className={style.error}>{errors.email}</div>
                )}
              </div>

              {/* Mantém os campos de senha normalmente */}
              <div className={style.formGroup}>
                <label htmlFor="senha" className={style.label}>
                  Senha*
                </label>
                <InputUpdate
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

              <div className={style.formGroup}>
                <label htmlFor="confirm_senha" className={style.label}>
                  Confirmar senha*
                </label>
                <InputUpdate
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

              <CustomButton
                type="submit"
                variant="default"
                size="lg"
                className={style.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </CustomButton>
              <CustomButton
                type="button"
                variant="destructive"
                size="lg"
                className={style.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Excluindo..." : "Excluir Conta"}
              </CustomButton>
            </form>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
