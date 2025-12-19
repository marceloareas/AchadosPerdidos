import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/layout/Layout";
import style from "./Chats.module.scss";
import { useSearchParams } from "react-router-dom";
import ScrollListChats from "../../components/scrollListChats/ScrollListChats";
import Chat from "../../components/chat/Chat";
import useChatStore from "../../store/chat";
import useAuthStore from "../../store/auth";
import useItemStore from "../../store/item";

const Chats = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 600;

  const [searchParams] = useSearchParams();
  const matchParam = searchParams.get("match");

  const { chats, getChats, getChat } = useChatStore();
  const chatAtual = useChatStore((state) => state.chatAtual);

  const { user } = useAuthStore();
  const { itemsUser, getUserItens } = useItemStore();

  const [chatSelect, setChatSelect] = useState(undefined);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getChats();
    getUserItens();
  }, []);

  const chatsOrdenados = useMemo(() => {
    if (!chats || chats.length === 0) return [];

    return [...chats].sort((a, b) => {
      const dateA = a.ultimaMensagem?.dataEnvio
        ? new Date(a.ultimaMensagem.dataEnvio).getTime()
        : 0;

      const dateB = b.ultimaMensagem?.dataEnvio
        ? new Date(b.ultimaMensagem.dataEnvio).getTime()
        : 0;

      return dateB - dateA; // mais recente primeiro
    });
  }, [chats]);

  const selectChat = async (chat) => {
    setChatSelect(chat);
    await getChat(chat.match_id);

    if (isMobile) {
      setShowList(false);
    }
  };

  const handleBackToList = () => {
    setShowList(true);
    setChatSelect(undefined);
  };

  useEffect(() => {
    if (!matchParam || chatsOrdenados.length === 0) return;

    const chatByMatch = chatsOrdenados.find(
      (chat) => String(chat.match_id) === String(matchParam)
    );

    if (chatByMatch) {
      selectChat(chatByMatch);
    }
  }, [matchParam, chatsOrdenados]);

  return (
    <Layout>
      <div className={style.chats}>
        {(!isMobile || showList) && (
          <>
            {chatsOrdenados.length > 0 ? (
              <ScrollListChats
                items={itemsUser}
                chats={chatsOrdenados}
                selectChat={selectChat}
              />
            ) : (
              <div className={style.emptyChats}>
                <p>Você ainda não possui nenhum chat.</p>
                <span>Quando houver um chat, ele aparecerá aqui.</span>
              </div>
            )}

            {!isMobile && chatsOrdenados.length > 0 && (
              <span className={style.lineV} />
            )}
          </>
        )}

        {(!isMobile || !showList) && chatsOrdenados.length > 0 && (
          <section className={style.unitChat}>
            {chatAtual && chatSelect && chatAtual.id === chatSelect.id ? (
              <Chat
                items={itemsUser}
                matchId={chatAtual.match_id}
                itemsMatches={{
                  nomeItemAchado: chatSelect.nomeItemAchado,
                  nomeItemPerdido: chatSelect.nomeItemPerdido,
                }}
                person={chatAtual.usuarios.find(
                  (usr) => usr.nome !== user.nome
                )}
                mensagens={chatAtual.mensagens}
                otherUserId={
                  chatAtual.usuarios.find((usr) => usr.nome !== user.nome)?.id
                }
                currentUserId={
                  chatAtual.usuarios.find((usr) => usr.nome === user.nome)?.id
                }
                onBack={isMobile ? handleBackToList : null}
                chat={chatAtual}
                isMatchFinalizado={chatSelect.isMatchFinalizado}
              />
            ) : !isMobile && chatsOrdenados.length > 0 ? (
              <div className={style.notChat}>
                <span>Selecione um chat para ver.</span>
              </div>
            ) : (
              <></>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Chats;
