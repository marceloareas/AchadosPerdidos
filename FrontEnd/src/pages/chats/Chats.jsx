import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import style from "./Chats.module.scss";
import { useSearchParams } from "react-router-dom";
import ScrollListChats from "../../components/scrollListChats/ScrollListChats";
import Chat from "../../components/chat/Chat";
import useChatStore from "../../store/chat";
import useAuthStore from "../../store/auth";
import useItemStore from "../../store/item";
import { connectWebSocket } from "../../utils/config/WebSocket_config";

const Chats = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 600;

  const [searchParams] = useSearchParams();
  const { getChat, getChats, chats } = useChatStore();
  const chatAtual = useChatStore((state) => state.chatAtual);

  const { user } = useAuthStore();
  const { itemsUser, getUserItens } = useItemStore();

  const match = searchParams.get("match");
  const [chatSelect, setChatSelect] = useState(undefined);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    connectWebSocket();
  }, []);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    getChats();
    getUserItens();
    if (searchParams)
      chats.map((chat) => {
        if (chat.match_id == match) selectChat(chat);
      });
  }, []);
  useEffect(() => {
    getChats();
  }, []);
  return (
    <Layout>
      <div className={style.chats}>
        {(!isMobile || showList) && (
          <>
            <ScrollListChats
              items={itemsUser}
              chats={chats}
              selectChat={selectChat}
            />
            {!isMobile && <span className={style.lineV} />}
          </>
        )}
        {(!isMobile || !showList) && (
          <section className={style.unitChat}>
            {chatAtual && chatSelect && chatSelect?.id === chatAtual.id ? (
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
