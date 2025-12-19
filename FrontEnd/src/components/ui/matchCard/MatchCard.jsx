import React, { useState } from "react";
import { Card, CardContent, Tooltip, Chip } from "@mui/material";
import { Trash2, Archive, ArchiveRestore, MessageCircle } from "lucide-react";
import ItemCard from "../itemCard/ItemCard";
import CustomButton from "../button/CustomButton";
import style from "./MatchCard.module.scss";
import { useNotification } from "../../../utils/NotificationContext";
import ModalDelete from "../dialog/ModalDelete";
import useMatchStore from "../../../store/match";
import useChatStore from "../../../store/chat";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ match, hasChat }) => {
  const itemUsuario = match.itemUsuario;
  const itemOposto = match.itemOposto;

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleModalOpen = (type) => {
    setModalType(type);
    setOpenModal(true);
  };

  const tipoFinalizacaoLabel = {
    CONCLUSAO_MATCH: "Item recuperado",
    CONCLUSAO_OUTRO_MATCH: "Item recuperado em outro match",
  };
  const handleModalClose = () => setOpenModal(false);

  const { showNotification } = useNotification();

  const {
    deleteMatch,
    matchArchive,
    matchActivate,
    getMatchesAtivos,
    getMatchesArquivados,
  } = useMatchStore();

  const { getChat, getChats } = useChatStore();

  const isFinished = match.isFinalizado === true;

  const isArchived =
    !isFinished &&
    itemUsuario.tipo === "ACHADO" &&
    match.arquivadoPorItemAchado === true
      ? true
      : !!(itemUsuario.tipo === "PERDIDO" && match.arquivadoPorItemPerdido);

  const handleDelete = async (idMatch) => {
    setIsLoading(true);
    try {
      await deleteMatch(idMatch);

      const { error, response } = useMatchStore.getState();
      handleModalClose();
      if (error) {
        showNotification(response, "error");
        setTimeout(() => setIsLoading(false), 1000);
      } else {
        showNotification(response, "success");
        await getMatchesAtivos();
        await getMatchesArquivados();
      }
    } catch (err) {
      console.error(err);
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
      if (error) {
        showNotification("Erro ao arquivar.", "error");
      } else {
        showNotification(response, "success");
        await getMatchesAtivos();
        await getMatchesArquivados();
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
      if (error) {
        showNotification("Erro ao restaurar.", "error");
      } else {
        showNotification(response, "success");
        await getMatchesAtivos();
        await getMatchesArquivados();
      }
    } catch {
      showNotification("Erro ao restaurar.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateViewChat = async (idMatch) => {
    setIsLoading(true);

    try {
      await getChat(idMatch);
      const { error, response } = useChatStore.getState();
      if (error) {
        showNotification("Erro ao criar chat", "error");
      } else {
        showNotification(response, "success");
        await getChats();
      }
      navigate(`/chats/?match=${idMatch}`);
    } catch {
      showNotification("Erro ao criar chat", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={style.matchCard} variant="outlined">
        <CardContent className={style.matchCardContent}>
          <div className={style.matchCardHeader}>
            {isFinished && match.tipoFinalizacaoMatch ? (
              <Chip
                label={tipoFinalizacaoLabel[match.tipoFinalizacaoMatch]}
                className={style.finalizadoChip}
                size="small"
              />
            ) : (
              <div />
            )}

            {isArchived || isFinished ? (
              <Trash2
                className={style.option_icon_delete}
                onClick={() => handleModalOpen("delete")}
              />
            ) : (
              <Tooltip title="Arquivar Match" placement="top">
                <Archive
                  className={style.option_icon_delete}
                  onClick={() => handleModalOpen("archive")}
                />
              </Tooltip>
            )}
          </div>

          {/* Item do usuário */}
          <ItemCard
            showDescription={false}
            showOptions={false}
            id={itemUsuario.id}
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
            id={itemOposto.id}
            itemType={itemOposto?.tipo}
            category={itemOposto?.categorias}
            title={itemOposto?.nome}
            description={itemOposto?.descricao}
            location={itemOposto?.localizacao}
            personName={itemOposto?.personName}
          />

          {isFinished ? (
            <CustomButton
              variant={"default"}
              className={style.matchChatButton}
              fullWidth
              disabled
            >
              Match Finalizado
            </CustomButton>
          ) : isArchived ? (
            <CustomButton
              variant={"default"}
              className={style.matchChatButton}
              fullWidth
              onClick={() => handleRestore(match.id)}
            >
              <ArchiveRestore className={style.icon} />
              Restaurar Match
            </CustomButton>
          ) : (
            <CustomButton
              variant={"default"}
              className={style.matchChatButton}
              onClick={() => handleCreateViewChat(match.id)}
              fullWidth
            >
              <MessageCircle className={style.icon} />
              {hasChat ? "Continuar conversa" : "Iniciar conversa"}
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
