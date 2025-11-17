import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Box, Typography } from "@mui/material";
import style from "./Chats.module.scss";
import ChatCard from "../../components/ui/chatCard/ChatCard";
import ScrollListChats from "../../components/scrollListChats/ScrollListChats";

const Chats = () => {
  const chats = [
    {
      id: 1,
      mensagem_texto: [
        {
          usuario: "usuario1",
          conteudo: "Olá, como você está?",
          dateSend: "2025-11-15T08:00:00Z",
        },
        {
          usuario: "usuario2",
          conteudo: "Estou bem, e você?",
          dateSend: "2025-11-15T15:21:00Z",
        },
      ],
      item: "ecobag",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "usuario1",
          nome: "João",
        },
        {
          usuario_id: "usuario2",
          nome: "Maria",
        },
      ],
      match_id: "match_1",
    },
    {
      id: 2,
      mensagem_texto: [
        {
          usuario: "usuario3",
          conteudo: "O pedido foi enviado?",
          dateSend: "2025-11-14T09:00:00Z",
        },
      ],
      item: "chuteira vermelha",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "usuario3",
          nome: "Carlos",
        },
        {
          usuario_id: "usuario4",
          nome: "Ana",
        },
      ],
      match_id: "match_2",
    },
    {
      id: 3,
      mensagem_texto: [
        {
          usuario: "usuario4",
          conteudo: "Sim, chegou tudo certo?",
          dateSend: "2025-11-10T10:00:00Z",
        },
        {
          usuario: "usuario5",
          conteudo: "Sim, obrigado!",
          dateSend: "2025-11-10T10:05:00Z",
        },
      ],
      item: "estojo",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "usuario4",
          nome: "Ana",
        },
        {
          usuario_id: "usuario5",
          nome: "Roberta",
        },
      ],
      match_id: "match_3",
    },
    {
      id: 4,
      mensagem_texto: [
        {
          usuario: "usuario8",
          conteudo: "Temos algum novo pedido?",
          dateSend: "2025-11-10T11:00:00Z",
        },
      ],
      item: "borracha do mário",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "usuario8",
          nome: "Pedro",
        },
        {
          usuario_id: "usuario7",
          nome: "Lucas",
        },
      ],
      match_id: "match_4",
    },
    {
      id: 5,
      mensagem_texto: [
        {
          usuario: "usuario8",
          conteudo: "Temos algum novo pedido?",
          dateSend: "2025-11-10T11:00:00Z",
        },
      ],
      item: "borracha do mário",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "usuario8",
          nome: "Pedro",
        },
        {
          usuario_id: "usuario7",
          nome: "Lucas",
        },
      ],
      match_id: "match_4",
    },
    {
      id: 6,
      mensagem_texto: [
        {
          usuario: "usuario8",
          conteudo: "Temos algum novo pedido?",
          dateSend: "2025-11-10T11:00:00Z",
        },
      ],
      item: "borracha do mário",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "usuario8",
          nome: "Pedro",
        },
        {
          usuario_id: "usuario7",
          nome: "Lucas",
        },
      ],
      match_id: "match_4",
    },
    {
      id: 7,
      mensagem_texto: [
        {
          usuario: "usuario8",
          conteudo: "Temos algum novo pedido?",
          dateSend: "2025-11-10T11:00:00Z",
        },
      ],
      item: "borracha do mário",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "usuario8",
          nome: "Pedro",
        },
        {
          usuario_id: "usuario7",
          nome: "Lucas",
        },
      ],
      match_id: "match_4",
    },
  ];
  const [chatSelect, setChat] = useState(undefined);
  return (
    <Layout>
      <section className={style.titleChats}>
        <Box className={style.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            Meus Chats
          </Typography>
        </Box>
      </section>
      <div className={style.chats}>
        <ScrollListChats chats={chats} />
        <span className={style.lineV} />
        <section className={style.unitChat}>
          {chatSelect ? <Box /> : <span> Selecione um chat para ver.</span>}
        </section>
      </div>
    </Layout>
  );
};

export default Chats;
