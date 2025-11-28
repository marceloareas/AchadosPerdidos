import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import { Trash2, Archive, ArchiveRestore } from "lucide-react";
import ItemCard from "../itemCard/ItemCard";
import CustomButton from "../button/CustomButton";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import style from "./MatchCard.module.scss";
import { useNotification } from "../../../utils/NotificationContext";
import ModalDelete from "../dialog/ModalDelete";
import useMatchStore from "../../../store/match";

const MatchCard = ({ match }) => {
  const itemUsuario = match.itemUsuario;
  const itemOposto = match.itemOposto;

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleModalOpen = (type) => {
    setModalType(type);
    setOpenModal(true);
  };
  const handleModalClose = () => setOpenModal(false);

  const { showNotification } = useNotification();

  const { deleteMatch, matchArchive, matchActivate } = useMatchStore();

  const isUsersItemAchado = itemUsuario.tipo === "ACHADO";
  const isArchived = isUsersItemAchado
    ? match.arquivadoPorItemAchado
    : match.arquivadoPorItemPerdido;

  const handleDelete = async (idMatch) => {
    setIsLoading(true);
    try {
      await deleteMatch(idMatch);
      const { error, response } = useMatchStore.getState();
      handleModalClose();
      if (!error) {
        showNotification(response, "success");
        await get().getMatchesAtivos();
        await get().getMatchesArquivados();
      } else {
        showNotification(response, "error");
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch {
      showNotification("Erro ao deletar!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (idMatch) => {
    setIsLoading(true);
    try {
      await matchArchive(idMatch);
      const { error, response } = useMatchStore.getState();
      if (!error) {
        showNotification(response, "success");
      } else {
        showNotification("Erro ao arquivar.", "error");
      }
      handleModalClose();
    } catch {
      showNotification("Erro ao arquivar.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (idMatch) => {
    setIsLoading(true);

    try {
      await matchActivate(idMatch);
      const { error, response } = useMatchStore.getState();
      if (!error) {
        showNotification(response, "success");
      } else {
        showNotification("Erro ao restaurar.", "error");
      }
    } catch {
      showNotification("Erro ao restaurar.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={style.matchCard} variant="outlined">
        <CardContent className={style.matchCardContent}>
          {/* --- Ícone de ação --- */}
          {!isArchived ? (
            <Archive
              className={style.option_icon_delete}
              onClick={() => handleModalOpen("archive")}
            />
          ) : (
            <Trash2
              className={style.option_icon_delete}
              onClick={() => handleModalOpen("delete")}
            />
          )}

          {/* Item do usuário */}
          <ItemCard
            showDescription={false}
            showOptions={false}
            itemType={itemUsuario?.tipo}
            category={itemUsuario?.categorias}
            title={itemUsuario?.nome}
            description={itemUsuario?.descricao}
            location={itemUsuario?.localizacao}
            personName={itemUsuario?.personName}
          />

          {/* Item da outra pessoa */}
          <ItemCard
            showDescription={false}
            showOptions={false}
            itemType={itemOposto?.tipo}
            category={itemOposto?.categorias}
            title={itemOposto?.nome}
            description={itemOposto?.descricao}
            location={itemOposto?.localizacao}
            personName={itemOposto?.personName}
          />

          {!isArchived ? (
            <Link to={`/chat/${match.id}`} className={style.matchChatLink}>
              <CustomButton
                variant={"default"}
                className={style.matchChatButton}
                fullWidth
              >
                <MessageCircle className={style.icon} />
                {match.chat ? "Continuar conversa" : "Iniciar conversa"}
              </CustomButton>
            </Link>
          ) : (
            <CustomButton
              variant={"default"}
              className={style.matchChatButton}
              fullWidth
              onClick={() => handleRestore(match.id)}
            >
              <ArchiveRestore className={style.icon} />
              Restaurar Match
            </CustomButton>
          )}
        </CardContent>
      </Card>

      <ModalDelete
        open={openModal}
        onClose={handleModalClose}
        title={
          modalType === "delete"
            ? "Deseja deletar este match?"
            : "Deseja arquivar este match?"
        }
        content={
          modalType === "delete"
            ? "Essa operação não poderá ser desfeita."
            : "Você poderá restaurar o match depois."
        }
      >
        <CustomButton
          type="button"
          variant="default"
          size="lg"
          onClick={handleModalClose}
          disabled={isLoading}
        >
          {isLoading ? "Cancelando..." : "Cancelar"}
        </CustomButton>

        <CustomButton
          type="button"
          variant={modalType === "delete" ? "destructive" : "default"}
          size="lg"
          onClick={
            modalType === "delete"
              ? () => handleDelete(match.id)
              : () => handleArchive(match.id)
          }
          disabled={isLoading}
        >
          {isLoading
            ? modalType === "delete"
              ? "Deletando..."
              : "Arquivando..."
            : modalType === "delete"
            ? "Deletar"
            : "Arquivar"}
        </CustomButton>
      </ModalDelete>
    </>
  );
};

export default MatchCard;
