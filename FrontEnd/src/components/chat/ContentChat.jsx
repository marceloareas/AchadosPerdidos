import { useLayoutEffect, useRef } from "react";
import BalaoMensagem from "./BalaoMensagem";
import style from "./Chat.module.scss";

const ContentChat = ({ listMessage, otherUserId }) => {
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [listMessage.length]);

  return (
    <div className={style.contentChat}>
      {listMessage?.map((mensagem, index) => {
        const prev = listMessage[index - 1];
        const next = listMessage[index + 1];
        const isFirst =
          !prev ||
          prev.remetenteId !== mensagem.remetenteId ||
          prev.destinatarioId !== mensagem.destinatarioId;
        const isLast =
          !next ||
          next.remetenteId !== mensagem.remetenteId ||
          next.destinatarioId !== mensagem.destinatarioId;
        return (
          <BalaoMensagem
            key={index}
            conteudo={mensagem}
            isFirst={isFirst}
            isLast={isLast}
            otherUserId={otherUserId}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ContentChat;
