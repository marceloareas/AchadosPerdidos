import React, { useState } from "react";
import style from "./Profile.module.scss";
import Footer from "../../components/footer/Footer";
import { BiSolidUserCircle } from "react-icons/bi";
import { IoReturnUpBackOutline } from "react-icons/io5";
import InputUpdate from "../../components/ui/inputUpdate/InputUpdate";
import CustomButton from "../../components/ui/button/CustomButton.jsx";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../utils/NotificationContext.jsx";
import { registerSchema } from "../../validation/validation";

const Profile = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const onNavigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    try {
      await registerSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
    console.log(errors);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const formToSend = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      };

      await createUser(formToSend);

      // if (!error) {
      setFormData({
        nome: "",
        email: "",
        senha: "",
      });
      showNotification("Usuário atualizado com sucesso!", "success");
      // }
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
            <h1 className={style.title}>Olá, usuário.</h1>
            <h3 className={style.subtitle}> Visualize seus dados abaixo.</h3>
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
              {/* Email */}
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

              {/* Senha */}
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

              {/* Confirmar senha */}
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
              {/* Submit */}
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
