import React from "react";
import { Box, Typography } from "@mui/material";
import MatchCard from "../../components/ui/matchCard/MatchCard";
import style from "./Matches.module.scss";
import Layout from "../../components/layout/Layout";

// Mock data para matches
const matchesMock = [
  {
    id: 1,
    chat: null, // chat não iniciado
    itens: new Set([
      {
        id: 1,
        type: "PERDIDO",
        category: "Eletrônicos",
        date: "2024-06-10",
        title: "iPhone 13 Pro Azul",
        description: "iPhone 13 Pro azul, com capinha transparente",
        location: "Biblioteca Central",
        personName: "Ana" // dar um jeito de pegar o nome do usuario no card de match
      },
      {
        id: 2,
        type: "ACHADO",
        date: "2024-06-10",
        category: "Eletrônicos",
        title: "Celular iPhone Encontrado",
        description: "Encontrei um iPhone azul com capinha",
        location: "Próximo à Biblioteca",
        personName: "Maria"
      }
    ])
  },
  {
    id: 2,
    chat: { id: 5 }, // chat iniciado
    itens: new Set([
      {
        id: 3,
        type: "PERDIDO",
        date: "2024-06-08",
        category: "Acessórios",
        title: "Mochila Preta Jansport",
        description: "Mochila preta com patches de bandas de rock",
        location: "Lab. de Informática",
        personName: "João"
      },
      {
        id: 4,
        type: "ACHADO",
        date: "2024-06-09",
        category: "Acessórios",
        title: "Mochila Encontrada",
        description: "Mochila preta com adesivos encontrada no corredor",
        location: "Corredor do 3º andar",
        personName: "Ana"
      }
    ])
  }

];

const Matches = () => {
  return (
    <Layout>
      <Box className={style.matchesPage}>
        <Box className={style.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            Matches
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Encontramos {matchesMock.length} correspondências para seus itens
          </Typography>
        </Box>

        <Box className={style.matchList}>
          {matchesMock.length === 0 ? (
            <Box className={style.emptyState}>
              <Typography variant="h6">Nenhum match encontrado</Typography>
              <Typography variant="body2">
                Cadastre seus itens para encontrarmos correspondências
              </Typography>
            </Box>
          ) : (
            matchesMock.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Matches;
