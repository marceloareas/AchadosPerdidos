import BalaoMensagem from "./BalaoMensagem";
import style from "./Chat.module.scss";

const ContentChat = ({ listMessage }) => {
  return (
    <div className={style.contentChat}>
      {listMessage &&
        listMessage?.map((mensagem) => <BalaoMensagem conteudo={mensagem} />)}
    </div>
  );
};

export default ContentChat;
