import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import { Edit, Trash2, X } from "lucide-react";
import Badge from "../../badge/Bagde";
import ModalDelete from "../ModalDelete";
import CustomButton from "../../button/CustomButton";
import style from "./ModalView.module.scss";
import dayjs from "dayjs";

const ModalView = ({
  open,
  onClose,
  item,
  onEdit,
  onDelete,
  showOptions = false,
  isDeleting = false,
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  if (!item) return null;

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box className={style.header}>
            <Box className={style.titleContainer}>
              <Typography variant="h6" className={style.title}>
                {item.title}
              </Typography>

              {item.type && (
                <Badge
                  badgeType="item"
                  type={item.type}
                  label={
                    item.type === "PERDIDO"
                      ? "Item Perdido"
                      : item.type === "ACHADO"
                      ? "Item Encontrado"
                      : "Item Devolvido"
                  }
                />
              )}

              {item.category && (
                <Badge badgeType="category" label={item.category} />
              )}
            </Box>

            <Box className={style.actions}>
              {showOptions && (
                <>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(item.id)}
                    className={style.iconButton}
                  >
                    <Edit size={20} />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={handleOpenDeleteModal}
                    className={`${style.iconButton} ${style.delete}`}
                    disabled={isDeleting}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </>
              )}

              <IconButton size="small" onClick={onClose}>
                <X size={20} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent className={style.content}>
          {item.location && (
            <Box className={style.section}>
              <Typography variant="subtitle2" color="textSecondary">
                Local
              </Typography>
              <Typography>{item.location}</Typography>
            </Box>
          )}

          {item.description && (
            <Box className={style.section}>
              <Typography variant="subtitle2" color="textSecondary">
                Descrição
              </Typography>
              <Typography>{item.description}</Typography>
            </Box>
          )}

          {item.date && (
            <Box className={style.section}>
              <Typography variant="subtitle2" color="textSecondary">
                Data
              </Typography>
              <Typography>{dayjs(item.date).format("DD/MM/YYYY")}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <ModalDelete
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Deseja mesmo deletar este item?"
        content="Essa ação não poderá ser desfeita."
      >
        <CustomButton
          type="button"
          variant="default"
          size="lg"
          onClick={handleCloseDeleteModal}
          disabled={isDeleting}
        >
          {isDeleting ? "Cancelando..." : "Cancelar"}
        </CustomButton>

        <CustomButton
          type="button"
          variant="destructive"
          size="lg"
          onClick={() => {
            onDelete(item.id);
            handleCloseDeleteModal();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Deletando..." : "Deletar"}
        </CustomButton>
      </ModalDelete>
    </>
  );
};

export default ModalView;
