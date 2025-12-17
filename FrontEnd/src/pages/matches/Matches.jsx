import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import Layout from "../../components/layout/Layout";
import MatchCard from "../../components/ui/matchCard/MatchCard";
import useMatchStore from "../../store/match";
import useChatStore from "../../store/chat";
import { Activity, Archive, CheckCircle } from "lucide-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs/Tab.jsx";

import style from "./Matches.module.scss";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("ATIVO");

  const {
    matchesAtivos,
    matchesArquivados,
    matchesFinalizados,
    getMatchesAtivos,
    getMatchesArquivados,
    getMatchesFinalizados,
  } = useMatchStore();

  const { chats, getChats } = useChatStore();

  useEffect(() => {
    getChats();
    getMatchesAtivos();
    getMatchesArquivados();
    getMatchesFinalizados();
  }, []);

  useEffect(() => {
    if (activeTab === "ATIVO") getMatchesAtivos();
    if (activeTab === "ARQUIVADO") getMatchesArquivados();
    if (activeTab === "FINALIZADO") getMatchesFinalizados();
  }, [activeTab]);

  const matchesByTab = {
    ATIVO: matchesAtivos,
    ARQUIVADO: matchesArquivados,
    FINALIZADO: matchesFinalizados,
  };

  const currentMatches = matchesByTab[activeTab] || [];

  const matchesMemo = useMemo(() => {
    return currentMatches.map((match) => ({
      match,
      hasChat: chats.some((chat) => chat.match_id === match.id),
    }));
  }, [currentMatches, chats]);

  return (
    <Layout>
      <section className={style.matchesPage}>
        <Box className={style.header}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Matches
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            {currentMatches.length} matches
          </Typography>
        </Box>
      </section>
      <section className={style.filtro}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className={style.tabs_container}
        >
          <TabsList className={style.tabs_list}>
            <TabsTrigger value="ATIVO" className={style.tab_trigger}>
              <Activity size={16} />
              Ativos ({matchesAtivos.length})
            </TabsTrigger>

            <TabsTrigger value="ARQUIVADO" className={style.tab_trigger}>
              <Archive size={16} />
              Arquivados ({matchesArquivados.length})
            </TabsTrigger>

            <TabsTrigger value="FINALIZADO" className={style.tab_trigger}>
              <CheckCircle size={16} />
              Finalizados ({matchesFinalizados.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className={style.tabs_content}>
            {currentMatches.length === 0 ? (
              <Box className={style.emptyState}>
                <Typography variant="h6" align="center">
                  Nenhum match encontrado
                </Typography>
              </Box>
            ) : (
              <Box className={style.matchList}>
                {matchesMemo.map(({ match, hasChat }) => (
                  <MatchCard key={match.id} match={match} hasChat={hasChat} />
                ))}
              </Box>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default Matches;
