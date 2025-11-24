import React, { useEffect } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import MatchCard from "../../components/ui/matchCard/MatchCard";
import style from "./Matches.module.scss";
import Layout from "../../components/layout/Layout";
import useMatchStore from "../../store/match";
import { Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const { matches, getMatchesAtivos } = useMatchStore();
  const navigate = useNavigate();

  useEffect(() => {
    getMatchesAtivos();
  }, []);

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
            Array.isArray(matches) &&
            matches.length > 0 &&
            matches.map((match) => <MatchCard key={1} match={match} />)
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Matches;
