import React, { useEffect, useMemo } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import MatchCard from "../../components/ui/matchCard/MatchCard";
import style from "./Matches.module.scss";
import Layout from "../../components/layout/Layout";
import useMatchStore from "../../store/match";
import useChatStore from "../../store/chat";
import { useNavigate } from "react-router-dom";
import { Archive } from "lucide-react";

const Matches = () => {
  const { matches, getMatchesAtivos } = useMatchStore();
  const { chats, getChats } = useChatStore();

  const navigate = useNavigate();

  useEffect(() => {
    getMatchesAtivos();
    getChats();
  }, []);

  const matchesMemo = useMemo(() => {
    return matches.map((match) => ({
      match,
      hasChat: chats.some((chat) => chat.match_id === match.id),
    }));
  }, [matches, chats]);

  return (
    <Layout>
      <Box className={style.matchesPage}>
        <Box className={style.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            Matches
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            className={style.typography}
          >
            Encontramos {matches.length} correspondências para seus itens
          </Typography>

          <Tooltip title="Ver matches arquivados" arrow>
            <Archive
              className={style.archiveIcon}
              color="#0A497E"
              size={"30px"}
              onClick={() => navigate("/matches-arquivados")}
            />
          </Tooltip>
        </Box>

        <Box className={style.matchList}>
          {matches.length === 0 ? (
            <Box className={style.emptyState}>
              <Typography variant="h6">Nenhum match encontrado</Typography>
              <Typography variant="body2">
                Cadastre seus itens para encontrarmos correspondências
              </Typography>
            </Box>
          ) : (
            matchesMemo.map((item) => (
              <MatchCard
                key={item.match.id}
                match={item.match}
                hasChat={item.hasChat}
              />
            ))
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Matches;
