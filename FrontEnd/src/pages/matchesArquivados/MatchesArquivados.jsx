import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import MatchCard from "../../components/ui/matchCard/MatchCard";
import style from "./MatchesArquivados.module.scss";
import Layout from "../../components/layout/Layout";
import useMatchStore from "../../store/match";

const MatchesArquivados = () => {
  const { matchesArquivados, getMatchesArquivados } = useMatchStore();

  useEffect(() => {
    getMatchesArquivados();
  }, []);

  return (
    <Layout>
      <Box className={style.matchesPage}>
        <Box className={style.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            Matches arquivados
          </Typography>
        </Box>

        <Box className={style.matchList}>
          {matchesArquivados.length === 0 ? (
            <Box className={style.emptyState}>
              <Typography variant="h6">Nenhum match arquivado</Typography>
            </Box>
          ) : (
            Array.isArray(matchesArquivados) &&
            matchesArquivados.length > 0 &&
            matchesArquivados.map((match) => <MatchCard key={match.id} match={match} />)
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default MatchesArquivados;
