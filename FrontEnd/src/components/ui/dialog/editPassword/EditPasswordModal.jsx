import React, { useState } from "react";
import { Modal, Box, Typography, TextField, IconButton } from "@mui/material";
import CustomButton from "../../button/CustomButton.jsx";
import Input from "../../input/Input.jsx";
import CloseIcon from "@mui/icons-material/Close";
import useUserStore from "../../../../store/user.js";
import { updatePasswordSchema } from "../../../../validation/validation.jsx";
import { useNotification } from "../../../../utils/NotificationContext.jsx";
import style from "./EditPassModal.module.scss";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
const EditPasswordModal = ({ open, onClose }) => {
  const { updatePassword } = useUserStore();
  const [formData, setFormData] = useState({
    senha: "",
    confirmacaoSenha: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (!value || (Array.isArray(value) && value.length === 0)) {
      await updatePasswordSchema.validateAt(field, {
        ...formData,
        [field]: value,
      });
      setErrors((prev) => ({ ...prev, [field]: "Campo obrigatório" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const formtoSend = {
        senha: formData.senha,
        confirmacaoSenha: formData.confirmacaoSenha,
      };
      console.log(formtoSend);
      await updatePassword(formtoSend);
      const { error, response } = useUserStore.getState();
      if (!error) {
        setIsLoading(false);
        showNotification(response, "success");
        onClose();
      }
    } catch (err) {
      console.log();
    }
  };
  return (
    <>
      <Modal open={open} onClose={onClose} fullWidth maxWidth="sm">
        <Box sx={modalStyle}>
          {/* Header */}
          <Box className={style.modalHeader}>
            <Typography variant="h6" fontWeight="bold">
              Atualize sua senha
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {/* Nome */}
            <Box className={style.formGroup}>
              <Input
                type="password"
                label="Nova Senha *"
                placeholder="Coloque sua nova senha"
                value={formData.senha}
                onChange={(e) => handleInputChange("senha", e.target.value)}
                error={errors.senha}
              />
            </Box>
            <Box className={style.formGroup}>
              <Input
                type="password"
                label="Confirme sua nova senha *"
                placeholder="Confirme sua nova senha"
                value={formData.confirmacaoSenha}
                onChange={(e) =>
                  handleInputChange("confirmacaoSenha", e.target.value)
                }
                error={errors.confirmacaoSenha}
              />
            </Box>
            <Box display="flex" justifyContent="center" gap={1} mt={2}>
              <CustomButton
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                type="submit"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </CustomButton>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditPasswordModal;
