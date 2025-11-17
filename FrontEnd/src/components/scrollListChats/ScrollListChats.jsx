import style from "./ScrollListChats.module.scss";
import ChatCard from "../ui/chatCard/ChatCard";

const ScrollListChats = ({ chats }) => {
  return (
    <section className={style.listChats}>
      {chats.map((chat) => {
        return (
          <ChatCard
            key={chat.id}
            item={chat.item}
            idMatch={chat.match_id}
            personName={chat.usuarios_chat[1].nome}
            lastMessage={chat.mensagem_texto.slice(-1)[0]}
          />
        );
      })}
    </section>
  );
};

export default ScrollListChats;
