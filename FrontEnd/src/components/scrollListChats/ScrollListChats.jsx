import style from "./ScrollListChats.module.scss";
import ChatCard from "../ui/chatCard/ChatCard";

const ScrollListChats = ({ chats, selectChat }) => {
  return (
    <section className={style.listChats}>
      {chats.map((chat) => {
        return (
          <ChatCard
            handleSelect={() => selectChat(chat)}
            key={chat.id}
            item={chat.item}
            idMatch={chat.match_id}
            usuario={chat.usuarios_chat[1]}
            lastMessage={chat.mensagem_texto.slice(-1)[0]}
          />
        );
      })}
    </section>
  );
};

export default ScrollListChats;
