import { useState, useMemo, useEffect } from "react";
import style from "./Chat.module.scss";

import ContentChat from "../chat/ContentChat.jsx";
import HeaderChat from "./HeaderChat.jsx";
import Input from "./Input.jsx";
import useMatchStore from "../../store/match";
import ModalConfirm from "../ui/dialog/ModalConfirm.jsx";
import CustomButton from "../ui/button/CustomButton.jsx";
import { useNotification } from "../../utils/NotificationContext.jsx";
import useChatStore from "../../store/chat.js";

const Chat = ({
  itemsMatches,
  items,
  person,
  otherUserId,
  currentUserId,
  onBack,
  matchId,
  chat,
  isMatchFinalizado,
}) => {
  const { confirmMatch } = useMatchStore();
  //Puxando a novaMensagem e setNovaMensagem do contexto
  const { showNotification, novaMensagem, setNovaMensagem } = useNotification(); 
  const { getChat, getChats } = useChatStore();

  const [confirmModal, setConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Atualiza a tela automaticamente quando recebe mensagem pelo WebSocket
  useEffect(() => {
    if (novaMensagem) {
      // Verifica se a mensagem que chegou pertence a ESTE chat específico
      if (novaMensagem.chatId === chat.id) {
        // Atualiza as mensagens puxando do banco novamente
        getChat(chat.id);
        
        // Limpa a notificação para não ficar atualizando em loop
        setNovaMensagem(null);
      }
    }
  }, [novaMensagem, chat.id, getChat, setNovaMensagem]);

  const handleOpenModal = () => {
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  const meuitemNome = useMemo(() => {
    return items.find(
      (item) =>
        item.nome === itemsMatches.nomeItemAchado ||
        item.nome === itemsMatches.nomeItemPerdido
    );
  }, [items]);

  const handleMatchConfirm = async (idMatch) => {
    setIsLoading(true);
    try {
      await confirmMatch(idMatch);
      const { error, response } = useMatchStore.getState();
      if (error) {
        showNotification(response, "error");
        handleCloseModal();
        setTimeout(() => setIsLoading(false), 1000);
      } else {
        showNotification(response, "success");
        getChat(chat.id);
        getChats();
        handleCloseModal();
      }
      await getChat(idMatch);
    } catch {
      showNotification("Erro ao confirmar Devolução", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={style.chatLayout}>
        <HeaderChat
          item={meuitemNome?.nome}
          usuario={person.nome}
          onBack={onBack}
          openModal={handleOpenModal}
          botao={chat.botao}
          matchId={matchId}
        />
        <ContentChat listMessage={chat.mensagens} otherUserId={otherUserId} />
        {isMatchFinalizado ? (
          <div className={style.matchFinalizadoBanner}>
            🔒 Este match foi finalizado. O chat está somente para visualização.
          </div>
        ) : (
          <Input
            chat={chat}
            currentUserId={currentUserId}
            otherUserId={otherUserId}
            isMatchFinalizado={isMatchFinalizado}
          />
        )}
      </div>
      <ModalConfirm
        open={confirmModal}
        onClose={handleCloseModal}
        title={`Deseja confirmar a fase de ${chat?.botao?.nomeBotao
          ?.split("[")?.[1]
          ?.replace(/]/g, "")} do item?`}
        content={"Essa operação não poderá ser desfeita."}
      >
        <CustomButton
          type="button"
          variant="default"
          size="lg"
          onClick={handleCloseModal}
          disabled={isLoading}
        >
          {isLoading ? "Cancelando..." : "Cancelar"}
        </CustomButton>

        <CustomButton
          type="button"
          variant={"default"}
          size="lg"
          onClick={() => handleMatchConfirm(matchId)}
          disabled={isLoading}
        >
          {isLoading ? "Confirmando..." : "Confirmar"}
        </CustomButton>
      </ModalConfirm>
    </>
  );
};

export default Chat;