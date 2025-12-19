import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Eye, Edit, Trash2 } from "lucide-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Badge from "../badge/Bagde";
import style from "./ItemCard.module.scss";
import useItemStore from "../../../store/item";
import { useNotification } from "../../../utils/NotificationContext";
import CustomButton from "../button/CustomButton";
import ModalDelete from "../dialog/ModalDelete";
import ModalView from "../dialog/view/ModalView";
import ModalEditItem from "../dialog/editItem/ModalEditItem";
import { CalendarTodayOutlined } from "@mui/icons-material";
import dayjs from "dayjs";

const ItemCard = ({
  id,
  itemType,
  date,
  category,
  title,
  location,
  personName,
  description,
  showDescription = true,
  showOptions = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const { showNotification } = useNotification();

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const handleModalOpen = () => setOpenModalDelete(true);
  const handleModalClose = () => setOpenModalDelete(false);

  const [openModalView, setOpenModalView] = useState(false);
  const handleModalViewOpen = () => setOpenModalView(true);
  const handleModalViewClose = () => setOpenModalView(false);

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const handleModalEditOpen = () => setOpenModalEdit(true);
  const handleModalEditClose = () => setOpenModalEdit(false);

  const [isLoading, setIsLoading] = useState(false);
  const { deleteItem } = useItemStore();
  const previewDescription =
    description?.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      handleMenuClose();
      const { erro, response } = useItemStore.getState();
      if (erro) {
        showNotification(response, "error");
        setTimeout(() => setIsLoading(false), 1000);
      } else {
        showNotification(response, "success");
        setIsLoading(true);
      }
    } catch (err) {
      showNotification(err, "error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 1,
          boxShadow: 2,
          transition: "0.2s",
          "&:hover": { boxShadow: 6 },
          minHeight: 0,
          "& .MuiCardHeader-root": { py: 1, px: 2 },
          "& .MuiCardContent-root": { py: 1, px: 2 },
        }}
        onClick={handleModalViewOpen}
      >
        <CardHeader
          title={
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  {title}
                </Typography>
                <Badge
                  badgeType="item"
                  type={itemType}
                  label={
                    itemType === "PERDIDO"
                      ? "Item Perdido"
                      : itemType === "ACHADO"
                      ? "Item Encontrado"
                      : "Item Devolvido"
                  }
                />
              </Box>
              <Box>
                <Badge badgeType="category" label={category?.[0].nome} />
              </Box>
            </Box>
          }
          action={
            showOptions && (
              <>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e);
                  }}
                  size="small"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalViewOpen();
                      handleMenuClose();
                    }}
                  >
                    <Eye className={style.menu_item_icon} />
                    Visualizar
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalEditOpen();
                      handleMenuClose();
                    }}
                  >
                    <Edit className={style.menu_item_icon} />
                    Editar
                  </MenuItem>
                  <MenuItem
                    className={style.menu_delete}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalOpen();
                      handleMenuClose();
                    }}
                  >
                    <Trash2 className={style.menu_item_icon} />
                    Excluir
                  </MenuItem>
                </Menu>
              </>
            )
          }
        />

        <CardContent>
          {personName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Por: {personName}
            </Typography>
          )}
          {location && (
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              mb={showDescription && description ? 1 : 0}
            >
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Box>
          )}
          {showDescription && description && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {previewDescription}
            </Typography>
          )}
          {date && (
            <Box display="flex" alignItems="center" gap={0.5} mt={1}>
              <CalendarTodayOutlined fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {dayjs(date).format("DD/MM/YYYY")}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <ModalView
        open={openModalView}
        onClose={handleModalViewClose}
        item={{
          id,
          title,
          category: category?.[0].nome,
          location,
          personName,
          description,
          date,
          type: itemType,
        }}
        onEdit={() => handleModalEditOpen()}
        onDelete={() => handleDelete(id)}
        showOptions={showOptions}
        isDeleting={isLoading}
      />

      <ModalDelete
        open={openModalDelete}
        onClose={handleModalClose}
        title={"Deseja mesmo deletar este item?"}
        content={"Essa ação não poderá ser desfeita."}
      >
        <CustomButton
          type="button"
          variant="default"
          size="lg"
          onClick={handleModalClose}
          disabled={isLoading}
        >
          {isLoading ? "Cancelar..." : "Cancelar"}
        </CustomButton>
        <CustomButton
          type="button"
          variant="destructive"
          size="lg"
          onClick={() => handleDelete(id)}
          disabled={isLoading}
        >
          {isLoading ? "Deletando..." : "Deletar"}
        </CustomButton>
      </ModalDelete>

      <ModalEditItem
        open={openModalEdit}
        onClose={handleModalEditClose}
        item={{
          id,
          nome: title,
          descricao: description,
          categorias: category || [],
          localizacao: location,
          dataEvento: date,
          tipo: itemType,
        }}
      />
    </>
  );
};

export default ItemCard;
