import BalaoMensagem from "./BalaoMensagem";
import style from "./Chat.module.scss";

const ContentChat = ({ listMessage, otherUserId }) => {
  return (
    <div className={style.contentChat}>
      {listMessage?.map((mensagem, index) => (
        <BalaoMensagem
          key={index}
          conteudo={mensagem}
          otherUserId={otherUserId}
        />
      ))}
    </div>
  );
};

export default ContentChat;
