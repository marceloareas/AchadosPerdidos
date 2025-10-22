import React, { useState, useEffect } from "react";
import style from "./Profile.module.scss";
import Footer from "../../components/footer/Footer";
import { BiSolidUserCircle } from "react-icons/bi";
import { IoReturnUpBackOutline } from "react-icons/io5";
import InputUpdate from "../../components/ui/inputUpdate/InputUpdate";
import CustomButton from "../../components/ui/button/CustomButton.jsx";
import ModalDelete from "../../components/ui/dialog/ModalDelete.jsx";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../utils/NotificationContext.jsx";
import { updateUserSchema } from "../../validation/validation";
import EditPasswordModal from "../../components/ui/dialog/editPassword/EditPasswordModal.jsx";
import useUserStore from "../../store/user.js";
import useAuthStore from "../../store/auth.js";

const Profile = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
  });
  const onNavigate = useNavigate();
  const { updateUser, deleteUser } = useUserStore();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const [openUpdatePassModal, setOpenUpdatePassModal] = useState(false);

  const handleOpenUpdatePassModal = () => setOpenUpdatePassModal(true);
  const handleCloseUpdatePassModal = () => setOpenUpdatePassModal(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nome: user.nome,
        email: user.email,
      }));
    }
  }, [user]);

  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    try {
      await updateUserSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formtoSend = {
        nome: formData.nome,
        email: formData.email,
      };
      console.log(formtoSend);
      await updateUser(formtoSend);
      const { erro, response } = useUserStore.getState();
      if (!erro) {
        showNotification(
          response || "Usuário Atualizado com sucesso",
          "success"
        );
        setTimeout(() => {
          onNavigate("/");
        }, 1500);
      }
    } catch (err) {
      console.log();
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      await deleteUser();
    } catch (erro) {
      console.log();
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
              <a className={style.link} onClick={handleOpenUpdatePassModal}>
                Edite sua senha aqui
              </a>
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
                onClick={handleOpenDeleteModal}
                type="button"
                variant="destructive"
                size="lg"
                className={style.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Excluindo..." : "Excluir Conta"}
              </CustomButton>
            </form>
            <ModalDelete
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              title="Deseja mesmo deletar sua conta?"
              content="Essa ação não poderá ser desfeita."
            >
              <CustomButton
                onClick={handleCloseDeleteModal}
                type="button"
                variant="default"
                size="lg"
                className={style.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Cancelando..." : "Cancelar"}
              </CustomButton>
              <CustomButton
                onClick={handleDeleteUser}
                type="button"
                variant="destructive"
                size="lg"
                className={style.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Excluindo..." : "Excluir Conta"}
              </CustomButton>
            </ModalDelete>
            <EditPasswordModal
              open={openUpdatePassModal}
              onClose={handleCloseUpdatePassModal}
            />
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
