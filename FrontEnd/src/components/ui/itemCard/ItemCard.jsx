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
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../dialog/Dialog.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Eye, Edit, Trash2 } from "lucide-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Badge from "../badge/Bagde";
import style from "./ItemCard.module.scss";
import useItemStore from "../../../store/item";
import { useNotification } from "../../../utils/NotificationContext";
import CustomButton from "../button/CustomButton";

const ItemCard = ({
  id,
  itemType,
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
  const { showNotification } = useNotification();
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  // const [selectedItem, setSelectedItem] = useState null;
  const [isViewDeleteModalOpen, setIsViewDeleteModalOpen] = useState(false);
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
      if (!erro) {
        showNotification(response, "success");
        setIsLoading(true);
      } else {
        showNotification(response, "error");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
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
          "& .MuiCardHeader-root": { py: 1, px: 2 }, // menos padding no header
          "& .MuiCardContent-root": { py: 1, px: 2 }, // menos padding no conteúdo
        }}
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
                <Badge badgeType="category" label={category} />
              </Box>
            </Box>
          }
          action={
            showOptions && (
              <>
                <IconButton onClick={handleMenuOpen} size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem>
                    <Eye className={style.menu_item_icon} />
                    Visualizar
                  </MenuItem>
                  <MenuItem>
                    <Edit className={style.menu_item_icon} />
                    Editar
                  </MenuItem>
                  <MenuItem
                    className={style.menu_delete}
                    onClick={() => setIsViewDeleteModalOpen(true)}
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
        </CardContent>
      </Card>
      <Dialog
        open={isViewDeleteModalOpen}
        onOpenChange={setIsViewDeleteModalOpen}
      >
        <DialogTitle>Deseja mesmo deletar este item?</DialogTitle>
        <DialogContent>Essa ação não poderá ser desfeita.</DialogContent>
        <DialogActions>
          <CustomButton
            type="submit"
            variant="default"
            size="lg"
            className={style.submitButton}
            onClick={() => setIsViewDeleteModalOpen(false)}
            disabled={isLoading}
          >
            {isLoading ? "Cancelar..." : "Cancelar"}
          </CustomButton>
          <CustomButton
            type="button"
            variant="destructive"
            size="lg"
            className={style.submitButton}
            onClick={() => handleDelete(id)}
            disabled={isLoading}
          >
            {isLoading ? "Deletando..." : "Deletar"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemCard;
