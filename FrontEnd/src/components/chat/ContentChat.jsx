import BalaoMensagem from "./BalaoMensagem";
import style from "./Chat.module.scss";

const ContentChat = ({ listMessage, currentUserId }) => {
  return (
    <div className={style.contentChat}>
      {listMessage &&
        listMessage?.map((mensagem, index) => (
          <BalaoMensagem
            key={index}
            conteudo={mensagem}
            currentUserId={currentUserId}
          />
        ))}
    </div>
  );
};

export default ContentChat;
