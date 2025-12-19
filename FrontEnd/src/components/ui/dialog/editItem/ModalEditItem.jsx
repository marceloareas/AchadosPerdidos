import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";
import CustomButton from "../../button/CustomButton.jsx";
import Input from "../../input/Input.jsx";
import ResponsiveDatePickers from "../../datePicker/ResponsiveDatePicker.jsx";
import dayjs from "dayjs";
import useItemStore from "../../../../store/item.js";
import useCategoriaStore from "../../../../store/categoria.js";
import CloseIcon from "@mui/icons-material/Close";
import style from "./ModalEditItem.module.scss";
import { useNotification } from "./../../../../utils/NotificationContext.jsx";

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

const ModalEditItem = ({ open, onClose, item }) => {
  const { updateItem } = useItemStore();
  const { getCategorias, categorias } = useCategoriaStore();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categorias: [],
    localizacao: "",
    dataEvento: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCategorias();
  }, []);

  useEffect(() => {
    if (item.categorias) {
      setFormData({
        nome: item.nome || "",
        descricao: item.descricao || "",
        categorias: item.categorias || [],
        localizacao: item.localizacao || "",
        dataEvento: item.dataEvento ? dayjs(item.dataEvento) : null,
      });
      setErrors({});
    }
  }, [item]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (!value || (Array.isArray(value) && value.length === 0)) {
      setErrors((prev) => ({ ...prev, [field]: "Campo obrigatório" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.nome) newErrors.nome = "Campo obrigatório";
    if (!formData.descricao) newErrors.descricao = "Campo obrigatório";
    if (!formData.localizacao) newErrors.localizacao = "Campo obrigatório";
    if (!formData.categorias || formData.categorias.length === 0)
      newErrors.categorias = "Escolha ao menos uma categoria";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Mantém categorias originais se o usuário não alterou
      const categoriasEnviadas =
        formData.categorias && formData.categorias.length > 0
          ? formData.categorias
          : Array.isArray(item.categorias)
          ? item.categorias
          : [];

      const payload = {
        ...formData,
        categorias:
          item.tipo === "PERDIDO"
            ? categoriasEnviadas
            : categoriasEnviadas.length > 0
            ? [categoriasEnviadas[0]]
            : [],
        tipo: item.tipo,
        dataEvento: formData.dataEvento
          ? dayjs(formData.dataEvento).format("YYYY-MM-DDTHH:mm:ss")
          : null,
      };

      await updateItem(item.id, payload);
      showNotification(
          `Item ${
            item.tipo === "PERDIDO" ? "perdido" : "encontrado"
          } atuaizado!`,
          "success"
        );
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const maxCategories = item?.tipo === "PERDIDO" ? categorias.length : 1;

  const getModalTitle = () => {
    if (!item) return "Editar Item";
    if (item.tipo === "PERDIDO") return "Editar Item Perdido";
    if (item.tipo === "ACHADO") return "Editar Item Encontrado";
    return "Editar Item";
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box className={style.modalHeader}>
          <Typography variant="h6" fontWeight="bold">
            {getModalTitle()}
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
              label="Nome do Item *"
              placeholder="Ex: iPhone 13, Mochila preta..."
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              error={errors.nome}
            />
          </Box>

          {/* Categorias */}
          <Box className={style.formGroup}>
            {item?.tipo === "PERDIDO" ? (
              <Autocomplete
                multiple
                limitTags={maxCategories}
                options={categorias}
                value={formData.categorias}
                getOptionLabel={(option) => option?.nome || ""}
                onChange={(event, newValue) => {
                  if (item.tipo === "PERDIDO") {
                    handleInputChange("categorias", newValue || []);
                  } else {
                    handleInputChange("categorias", newValue ? [newValue] : []);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categorias *"
                    placeholder={
                      item?.tipo === "PERDIDO" && "Escolha categorias"
                    }
                    error={!!errors.categorias}
                    helperText={errors.categorias}
                  />
                )}
              />
            ) : (
              <Autocomplete
                id="category"
                options={categorias}
                getOptionLabel={(option) => option?.nome || ""}
                value={formData.categorias[0] || null}
                onChange={(event, newValue) => {
                  handleInputChange("categorias", newValue ? [newValue] : []);
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Categoria *" />
                )}
              />
            )}
            {errors.categorias && (
              <div className={style.error}>{errors.categorias}</div>
            )}
          </Box>

          {/* Localização */}
          <Box className={style.formGroup}>
            <Input
              label="Local *"
              placeholder="Ex: Biblioteca Central..."
              value={formData.localizacao}
              onChange={(e) => handleInputChange("localizacao", e.target.value)}
              error={errors.localizacao}
            />
          </Box>

          {/* Descrição */}
          <Box className={style.formGroup}>
            <TextField
              label="Descrição *"
              placeholder="Descreva o item em detalhes..."
              value={formData.descricao}
              multiline
              rows={4}
              fullWidth
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              error={!!errors.descricao}
              helperText={errors.descricao}
            />
          </Box>

          {/* Data do Evento */}
          <Box className={style.formGroup}>
            <ResponsiveDatePickers
              value={formData.dataEvento}
              onChange={(e) =>
                handleInputChange("dataEvento", e ? dayjs(e.$d) : null)
              }
              label="Data do Evento"
            />
          </Box>

          {/* Botões */}
          <Box display="flex" justifyContent="center" gap={1} mt={2}>
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </CustomButton>
            <CustomButton type="submit" variant="default" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </CustomButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalEditItem;
