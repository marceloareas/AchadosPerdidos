import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";
import Badge from "../../components/ui/badge/Bagde";

import Layout from "../../components/layout/Layout";
import { itemSchema } from "../../validation/validation.jsx";
import dayjs from "dayjs";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useNotification } from "../../utils/NotificationContext.jsx";
import useItemStore from "../../store/item.js";
import useCategoryStore from "../../store/categoria.js";
import ResponsiveDatePickers from "../../components/ui/datePicker/ResponsiveDatePicker.jsx";

import style from "./AddItem.module.scss";
import { useNavigate } from "react-router-dom";

const AddItem = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categorias: "",
    localizacao: "",
    dataEvento: "",
  });
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();
  const { createItem } = useItemStore();
  const { getCategorias, categorias } = useCategoryStore();

  const onNavigate = useNavigate();

  useEffect(() => {
    getCategorias();
  }, [getCategorias]);

  const defaultType = searchParams.get("type") || "PERDIDO";
  const [itemType, setItemType] = useState(
    defaultType === "ACHADO" ? "ACHADO" : "PERDIDO"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      nome: "",
      descricao: "",
      categorias: "",
      localizacao: "",
      dataEvento: "",
    });
  }, [itemType]);

  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    try {
      await itemSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      itemSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      let tipoItem = itemType == "PERDIDO" ? "PERDIDO" : "ACHADO";
      const formToSend = {
        tipo: tipoItem,
        nome: formData.nome,
        descricao: formData.descricao,
        categorias: formData.categorias,
        localizacao: formData.localizacao,
        dataEvento: formData.dataEvento,
      };
      await createItem(formToSend);
      const { erro, response } = useItemStore.getState();
      if (!erro) {
        setFormData({
          nome: "",
          descricao: "",
          categorias: "",
          localizacao: "",
          dataEvento: "",
        });
        showNotification(
          `Item ${
            itemType === "PERDIDO" ? "perdido" : "encontrado"
          } cadastrado!`,
          "success"
        );
        setTimeout(() => {
          setIsLoading(false);
          onNavigate("/itens");
        }, 1000);
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

  // Responsividade
  const [windowWidth, setWidth] = useState(window.innerWidth);
  const sizePage =
    windowWidth > 1024 ? "default " : windowWidth > 640 ? "lg" : "sm";

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const convertDate = (date) => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  };

  return (
    <Layout>
      <div className={style.pageContainer}>
        <div className={style.contentWrapper}>
          <h1 className={style.title}>Cadastrar Item</h1>

          {/* Toggle buttons */}
          <div className={style.toggleButtons}>
            <CustomButton
              variant={itemType === "PERDIDO" ? "default" : "outline"}
              size={sizePage}
              className={style.flexButton}
              onClick={() => setItemType("PERDIDO")}
            >
              <AlertCircle className={style.icon} />
              Perdi algo
            </CustomButton>
            <CustomButton
              variant={itemType === "ACHADO" ? "default" : "outline"}
              size={sizePage}
              className={style.flexButton}
              onClick={() => setItemType("ACHADO")}
            >
              <CheckCircle2 className={style.icon} />
              Encontrei algo
            </CustomButton>
          </div>

          <Badge
            badgeType="item"
            type={itemType}
            label={itemType === "PERDIDO" ? "Item Perdido" : "Item Encontrado"}
          />

          {/* Box de conteúdo */}
          <div className={style.formBox}>
            <h2 className={style.sectionTitle}>
              {itemType === "PERDIDO"
                ? "Descreva o que você perdeu"
                : "Descreva o que você encontrou"}
            </h2>

            <form onSubmit={handleSubmit} className={style.form}>
              {/* Nome do item */}
              <div className={style.formGroup}>
                <label htmlFor="nome" className={style.label}>
                  Nome do Item *
                </label>
                <Input
                  id="nome"
                  placeholder="Ex: iPhone 13, Mochila preta, Chaves..."
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
                {errors.nome && (
                  <div className={style.error}>{errors.nome}</div>
                )}
              </div>

              {/* Categorias */}
              <div className={style.formGroup}>
                <label htmlFor="category" className={style.label}>
                  categorias *
                </label>
                {itemType === "PERDIDO" ? (
                  <Autocomplete
                    multiple
                    id="category"
                    options={categorias}
                    value={formData.categorias ? formData.categorias : []}
                    getOptionLabel={(option) => option?.nome || ""}
                    onChange={(event, newValue) => {
                      handleInputChange("categorias", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Escolha uma ou mais categorias"
                      />
                    )}
                  />
                ) : (
                  <Autocomplete
                    id="category"
                    options={categorias}
                    getOptionLabel={(option) => option?.nome || ""}
                    // isOptionEqualToValue={(option, value) =>
                    //   option.id === value.id
                    // }
                    value={formData.categorias[0] || null}
                    onChange={(event, newValue) => {
                      handleInputChange(
                        "categorias",
                        newValue ? [newValue] : []
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Categoria *" />
                    )}
                  />
                )}
                {errors.categorias && (
                  <div className={style.error}>{errors.categorias}</div>
                )}
              </div>

              {/* Localização */}
              <div className={style.formGroup}>
                <label htmlFor="location" className={style.label}>
                  Local *
                </label>
                <Input
                  id="location"
                  placeholder="Ex: Biblioteca Central, Sala de Aula..."
                  value={formData.localizacao}
                  onChange={(e) =>
                    handleInputChange("localizacao", e.target.value)
                  }
                  required
                />
                {errors.localizacao && (
                  <div className={style.error}>{errors.localizacao}</div>
                )}
              </div>

              {/* Descrição */}
              <div className={style.formGroup}>
                <label htmlFor="description" className={style.label}>
                  Descrição *
                </label>
                <textarea
                  id="description"
                  className={style.textarea}
                  placeholder="Descreva o item em detalhes: cor, marca, modelo..."
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, descricao: e.target.value }))
                  }
                  onBlur={(e) => handleInputChange("descricao", e.target.value)}
                  rows={6}
                  required
                />
                {errors.descricao && (
                  <div className={style.error}>{errors.descricao}</div>
                )}
              </div>

              {/* Data */}
              <div className={style.formGroup}>
                <label htmlFor="dataEvento" className={style.label}>
                  {itemType === "PERDIDO"
                    ? "Data que você acha que perdeu"
                    : "Data em que encontrou"}
                </label>
                <ResponsiveDatePickers
                  id="dataEvento"
                  onChange={(e) => {
                    handleInputChange("dataEvento", convertDate(e.$d));
                  }}
                />
                {errors.dataEvento && (
                  <div className={style.error}>{errors.dataEvento}</div>
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
                {isLoading
                  ? "Cadastrando..."
                  : `Cadastrar Item ${
                      itemType === "PERDIDO" ? "Perdido" : "Encontrado"
                    }`}
              </CustomButton>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddItem;
