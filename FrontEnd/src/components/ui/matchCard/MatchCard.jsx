import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import { Trash2 } from "lucide-react";
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
  console.log(match);
  const [openModalDelete, setOpenDelete] = useState(false);
  const handleModalOpen = () => setOpenDelete(true);
  const handleModalClose = () => setOpenDelete(false);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { deleteMatch } = useMatchStore();

  const handleDelete = async (id) => {
    try {
      await deleteMatch(id);
      const { error, response } = useMatchStore.getState();
      handleModalClose();
      if (!error) {
        showNotification(response, "success");
        setIsLoading(true);
      } else {
        showNotification(response, "error");
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch (err) {
      showNotification(err, "error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={style.matchCard} variant="outlined">
        <CardContent className={style.matchCardContent}>
          <Trash2
            className={style.option_icon_delete}
            onClick={handleModalOpen}
          />
          {/* Item 1 */}
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

          {/* Item 2 */}
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

          {/* Botão de conversa */}
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
        </CardContent>
      </Card>
      <ModalDelete
        open={openModalDelete}
        onClose={handleModalClose}
        title={"Desejas recusar/deletar este match?"}
        content={"Essa operação não poderá ser desfeita."}
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
          onClick={() => handleDelete(match.id)}
          disabled={isLoading}
        >
          {isLoading ? "Deletando..." : "Deletar"}
        </CustomButton>
      </ModalDelete>
    </>
  );
};

export default MatchCard;
