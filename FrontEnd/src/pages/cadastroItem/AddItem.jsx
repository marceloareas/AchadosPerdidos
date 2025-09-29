import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import CustomButton from "../../components/ui/button/CustomButton";
import Input from "../../components/ui/input/Input";
import Badge from "../../components/ui/badge/Bagde";

import Layout from "../../components/layout/Layout";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import style from "./AddItem.module.scss";

const AddItem = () => {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "lost";

  const [itemType, setItemType] = useState(
    defaultType === "found" ? "found" : "lost"
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    color: "",
    additionalInfo: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Eletrônicos",
    "Acessórios",
    "Chaves",
    "Carteiras",
    "Documentos",
    "Roupas",
    "Livros",
    "Outros",
  ];
  const [windowWidth, setWidth] = useState(window.innerWidth);
  const sizePage =
    windowWidth > 1024 ? "default " : windowWidth > 640 ? "lg" : "sm";
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert(
        `Item ${itemType === "lost" ? "perdido" : "encontrado"} cadastrado!`
      );
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        color: "",
        additionalInfo: "",
      });
    }, 1500);
  };

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

          <Badge badgeType="item" type={itemType} label={itemType === "lost" ? "Item Perdido" : "Item Encontrado"} />

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
                      formData.category ? formData.category.split(",") : []
                    }
                    onChange={(event, newValue) => {
                      handleInputChange("category", newValue.join(","));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Escolha uma ou mais categorias"
                      />
                    )}
                  />
                ) : (
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Categoria *</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={formData.category}
                      label="Categoria *"
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      required
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  required
                />
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
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  required
                />
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
