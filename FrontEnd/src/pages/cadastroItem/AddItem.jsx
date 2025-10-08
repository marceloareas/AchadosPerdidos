import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";
import Badge from "../../components/ui/badge/Bagde";

import Layout from "../../components/layout/Layout";
import { itemSchema } from "../../validation/validation.jsx";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useNotification } from "../../utils/NotificationContext.jsx";
import useItemStore from "../../store/item.js";
import useCategoryStore from "../../store/categoria.js";

import style from "./AddItem.module.scss";

const AddItem = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    endereco: "",
    // color: "",
    // additionalInfo: "",
  });
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();
  const { createItem, loading, error } = useItemStore();
  const { getCategorias, categorias } = useCategoryStore();

  useEffect(() => {
    getCategorias();
  }, [getCategorias]);

  const defaultType = searchParams.get("type") || "lost";
  const [itemType, setItemType] = useState(
    defaultType === "found" ? "found" : "lost"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = categorias.map((cat) => cat.nome);

  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    try {
      await itemSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // setTimeout(() => {
    // setIsLoading(false);
    // alert(
    //   `Item ${itemType === "lost" ? "perdido" : "encontrado"} cadastrado!`
    // );
    //   setFormData({
    //     nome: "",
    //     descricao: "",
    //     categoria: "",
    //     endereco: "",
    //     // color: "",
    //     // additionalInfo: "",
    //   });
    //   showNotification(`Item ${itemType === "lost" ? "perdido" : "encontrado"} cadastrado!`, "success");
    //   onNavigate("/itens");
    // }, 1500);
    try {
      itemSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      const formToSend = {
        tipo: itemType,
        nome: formData.nome,
        descricao: formData.descricao,
        categoria: formData.categoria,
        endereco: formData.endereco,
      };
      if (!error) {
        setFormData({
          nome: "",
          descricao: "",
          categoria: "",
          endereco: "",
          // color: "",
          // additionalInfo: "",
        });
      }
      showNotification(
        `Item ${itemType === "lost" ? "perdido" : "encontrado"} cadastrado!`,
        "success"
      );
      onNavigate("/itens");
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
  return (
    <Layout>
      <div className={style.pageContainer}>
        <div className={style.contentWrapper}>
          <h1 className={style.title}>Cadastrar Item</h1>

          {/* Toggle buttons */}
          <div className={style.toggleButtons}>
            <CustomButton
              variant={itemType === "lost" ? "default" : "outline"}
              size={sizePage}
              className={style.flexButton}
              onClick={() => setItemType("lost")}
            >
              <AlertCircle className={style.icon} />
              Perdi algo
            </CustomButton>
            <CustomButton
              variant={itemType === "found" ? "default" : "outline"}
              size={sizePage}
              className={style.flexButton}
              onClick={() => setItemType("found")}
            >
              <CheckCircle2 className={style.icon} />
              Encontrei algo
            </CustomButton>
          </div>

          <Badge
            badgeType="item"
            type={itemType}
            label={itemType === "lost" ? "Item Perdido" : "Item Encontrado"}
          />

          {/* Box de conteúdo */}
          <div className={style.formBox}>
            <h2 className={style.sectionTitle}>
              {itemType === "lost"
                ? "Descreva o que você perdeu"
                : "Descreva o que você encontrou"}
            </h2>

            <form onSubmit={handleSubmit} className={style.form}>
              {/* Nome do item */}
              <div className={style.formGroup}>
                <label htmlFor="title" className={style.label}>
                  Nome do Item *
                </label>
                <Input
                  id="title"
                  placeholder="Ex: iPhone 13, Mochila preta, Chaves..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
                {errors.nome && (
                  <div className={style.error}>{errors.nome}</div>
                )}
              </div>

              {/* Categoria */}
              <div className={style.formGroup}>
                <label htmlFor="category" className={style.label}>
                  Categoria *
                </label>
                {itemType === "lost" ? (
                  <Autocomplete
                    multiple
                    id="category"
                    options={categories}
                    value={
                      formData.categoria ? formData.categoria.split(",") : []
                    }
                    onChange={(event, newValue) => {
                      handleInputChange("categoria", newValue.join(","));
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
                    // multiple
                    id="category"
                    options={categories}
                    value={
                      formData.categoria ? formData.categoria.split(",") : []
                    }
                    onChange={(event, newValue) => {
                      handleInputChange("categoria", newValue.join(","));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Categoria *" />
                    )}
                  />
                )}
                {errors.categoria && (
                  <div className={style.error}>{errors.categoria}</div>
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
                  value={formData.endereco}
                  onChange={(e) =>
                    handleInputChange("endereco", e.target.value)
                  }
                  required
                />
                {errors.endereco && (
                  <div className={style.error}>{errors.endereco}</div>
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
                    handleInputChange("descricao", e.target.value)
                  }
                  rows={6}
                  required
                />
                {errors.descricao && (
                  <div className={style.error}>{errors.descricao}</div>
                )}
              </div>

              {/* Cor */}
              <div className={style.formGroup}>
                <label htmlFor="color" className={style.label}>
                  Cor Principal
                </label>
                <Input
                  id="color"
                  placeholder="Ex: Azul, Preto, Vermelho..."
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
                {errors.color && (
                  <div className={style.error}>{errors.color}</div>
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
                      itemType === "lost" ? "Perdido" : "Encontrado"
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
