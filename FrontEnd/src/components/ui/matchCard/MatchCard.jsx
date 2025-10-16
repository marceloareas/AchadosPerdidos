import React from "react";
import { Card, CardContent } from "@mui/material";
import ItemCard from "../itemCard/ItemCard";
import CustomButton from "../button/CustomButton";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import style from "./MatchCard.module.scss";

const MatchCard = ({ match }) => {
  const itens = Array.from(match.itens);

  return (
    <Card className={style.matchCard} variant="outlined">
      <CardContent className={style.matchCardContent}>
        {/* Item 1 */}
        <ItemCard
          itemType={itens[0]?.type}
          category={itens[0]?.category}
          title={itens[0]?.title}
          description={itens[0]?.description}
          location={itens[0]?.location}
          personName={itens[0]?.personName}
        />

        {/* Item 2 */}
        <ItemCard
          itemType={itens[1]?.type}
          category={itens[1]?.category}
          title={itens[1]?.title}
          description={itens[1]?.description}
          location={itens[1]?.location}
          personName={itens[1]?.personName}
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
