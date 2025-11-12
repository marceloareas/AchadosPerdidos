import React from "react";
import dayjs from "dayjs";
import { CardHeader, Card, CardContent, Typography, Box } from "@mui/material";

const ChatCard = ({ id, item, idMatch, personName, lastMessage }) => {
  // const item = item;
  const convertDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };
  return (
    <>
      <Card style={{ width: "450px" }}>
        <CardHeader
          title={
            <Box display="flex" gap={0.5}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  {item}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  - {convertDate(lastMessage.dateSend)}
                </Typography>
              </Box>
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
            {personName}:{lastMessage.conteudo}
          </Typography>
          {/* )}
          {lastMessage && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
              noWrap={true}
            >
              {lastMessage.conteudo}
            </Typography> 
          )}*/}
        </CardContent>
      </Card>
    </>
  );
};

export default ChatCard;
