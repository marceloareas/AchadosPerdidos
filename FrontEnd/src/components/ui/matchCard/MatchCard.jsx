import React from "react";
import { Card, CardContent } from "@mui/material";
import ItemCard from "../itemCard/ItemCard";
import CustomButton from "../button/CustomButton";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import style from "./MatchCard.module.scss";

const MatchCard = ({ match }) => {
  const itemUsuario = match.itemUsuario;
  const itemOposto = match.itemOposto;

  return (
    <Card className={style.matchCard} variant="outlined">
      <CardContent className={style.matchCardContent}>
        {/* Item 1 */}
        <ItemCard
          itemType={itemUsuario?.tipo}
          category={itemUsuario?.categorias[0].nome}
          title={itemUsuario?.nome}
          description={itemUsuario?.descricao}
          location={itemUsuario?.localizacao}
          personName={itemUsuario?.personName}
        />

        {/* Item 2 */}
        <ItemCard
          itemType={itemOposto?.tipo}
          category={itemOposto?.categorias[0].nome}
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
  );
};

export default MatchCard;
