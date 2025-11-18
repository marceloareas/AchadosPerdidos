import style from "./Chat.module.scss";
import ContentChat from "../chat/ContentChat.jsx";

import HeaderChat from "./HeaderChat.jsx";
import Input from "./Input.jsx";

const Chat = ({ item, person, mensagens, currentUserId, onBack }) => {
  return (
    <div className={style.chatLayout}>
      <HeaderChat item={item} usuario={person.nome} onBack={onBack} />
      <ContentChat listMessage={mensagens} currentUserId={currentUserId} />
      <Input />
    </div>
  );
};

export default Chat;
