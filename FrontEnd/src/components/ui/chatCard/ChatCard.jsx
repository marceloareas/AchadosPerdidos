import React from "react";
import dayjs from "dayjs";
import { CardHeader, Card, CardContent, Typography, Box } from "@mui/material";
import style from "./ChatCard.module.scss";
import useAuthStore from "../../../store/auth";

const ChatCard = ({
  id,
  item,
  idMatch,
  usuarios,
  lastMessage,
  handleSelect,
}) => {
  const { user } = useAuthStore.getState();
  const convertDate = (date) => {
    const actualDateFormated = dayjs();
    const dateFormated = dayjs(date);

    if (actualDateFormated.isSame(dateFormated, "day")) {
      return dateFormated.format("HH:mm");
    } else if (
      actualDateFormated.subtract(1, "day").isSame(dateFormated, "day")
    ) {
      return "Ontem";
    }
    return dateFormated.format("DD/MM/YYYY");
  };

  const remetenteMensagem = usuarios.find(
    (usr) => usr.id === lastMessage?.remetenteId
  )?.nome;
  return (
    <Card className={`${style["MuiPaper-root"]}`} onClick={handleSelect}>
      <CardHeader
        title={
          <Box className={style.headerCard}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {item}
            </Typography>

            <Typography
              className={style.horarioLastMessage}
              sx={{
                color: "#706d6db2",
                fontSize: "0.9rem",
              }}
            >
              {convertDate(lastMessage?.dataEnvio)}
            </Typography>
          </Box>
        }
      />
      <CardContent style={{ flexdirection: "row" }}>
        {/* {personName && ( */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5 }}
          noWrap={true}
        >
          {remetenteMensagem === user.nome ? "Você" : remetenteMensagem}:{" "}
          {lastMessage?.conteudo}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
