import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Box, Typography } from "@mui/material";
import style from "./Chats.module.scss";
import ChatCard from "../../components/ui/chatCard/ChatCard";
import ScrollListChats from "../../components/scrollListChats/ScrollListChats";
import Chat from "../../components/Chat/chat";

const Chats = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 600;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          usuario: "vinicao",
          conteudo: "Ja enviei pelo uberFlash, ta bom?",
          dateSend: "2025-11-10T10:00:00Z",
        },
        {
          usuario: "usuario5",
          conteudo: "Ok, obrigada!",
          dateSend: "2025-11-10T10:05:00Z",
        },
        {
          usuario: "vinicao",
          conteudo: "Espero que esteja do estado que voce perdeu",
          dateSend: "2025-11-10T10:08:00Z",
        },
        {
          usuario: "vinicao",
          conteudo: "Assim que chegar, te aviso.",
          dateSend: "2025-11-10T10:10:00Z",
        },
        {
          usuario: "vinicao",
          conteudo: "E a senhora desce para buscar",
          dateSend: "2025-11-10T10:14:00Z",
        },
        {
          usuario: "usuario5",
          conteudo: "Ta bom, muito obrigada!",
          dateSend: "2025-11-10T10:15:00Z",
        },
        {
          usuario: "usuario5",
          conteudo:
            "Este estojo estava com todos os meu documentos, ainda bem que você encontrou e conseguiu me devolver.",
          dateSend: "2025-11-10T10:15:00Z",
        },
        {
          usuario: "vinicao",
          conteudo: "Ja enviei pelo uberFlash, ta bom?",
          dateSend: "2025-11-10T10:00:00Z",
        },
        {
          usuario: "usuario5",
          conteudo: "Ok, obrigada!",
          dateSend: "2025-11-10T10:05:00Z",
        },
        {
          usuario: "vinicao",
          conteudo: "Espero que esteja do estado que voce perdeu",
          dateSend: "2025-11-10T10:08:00Z",
        },
        {
          usuario: "vinicao",
          conteudo: "Assim que chegar, te aviso.",
          dateSend: "2025-11-10T10:10:00Z",
        },
        {
          usuario: "vinicao",
          conteudo: "E a senhora desce para buscar",
          dateSend: "2025-11-10T10:14:00Z",
        },
        {
          usuario: "usuario5",
          conteudo: "Ta bom, muito obrigada!",
          dateSend: "2025-11-10T10:15:00Z",
        },
        {
          usuario: "usuario5",
          conteudo:
            "Este estojo estava com todos os meu documentos, ainda bem que você encontrou e conseguiu me devolver.",
          dateSend: "2025-11-10T10:15:00Z",
        },
      ],
      item: "estojo",
      mensagem_imagem: null,
      mensagem_confirmacao: "SolicitacaoEntrega",
      usuarios_chat: [
        {
          usuario_id: "id",
          nome: "vinicao",
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
  ];
  const [chatSelect, setChat] = useState(undefined);
  const [showList, setShowList] = useState(true);

  const selectChat = (chat) => {
    setChat(chat);
    if (isMobile) {
      setShowList(false);
    }
  };

  const handleBackToList = () => {
    setShowList(true);
    setChat(undefined);
  };
  return (
    <Layout>
      <div className={style.chats}>
        {(!isMobile || showList) && (
          <>
            <ScrollListChats chats={chats} selectChat={selectChat} />
            {!isMobile && <span className={style.lineV} />}
          </>
        )}
        {(!isMobile || !showList) && (
          <section className={style.unitChat}>
            {chatSelect ? (
              <Chat
                item={chatSelect.item}
                person={chatSelect.usuarios_chat[1]}
                mensagens={chatSelect.mensagem_texto}
                currentUserId="vinicao"
                onBack={isMobile ? handleBackToList : null}
              />
            ) : (
              !isMobile && (
                <div className={style.notChat}>
                  <span> Selecione um chat para ver.</span>
                </div>
              )
            )}
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Chats;
