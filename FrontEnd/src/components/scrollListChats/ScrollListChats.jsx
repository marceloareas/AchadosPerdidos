import style from "./ScrollListChats.module.scss";
import ChatCard from "../ui/chatCard/ChatCard";

const ScrollListChats = ({ items, chats, selectChat }) => {
  const getMeuItemNome = (chat) => {
    return items.find(
      (item) =>
        item.nome === chat.nomeItemAchado || item.nome === chat.nomeItemPerdido
    )?.nome;
  };
  return (
    <section className={style.listChats}>
      {chats.map((chat) => {
        const itemNome = getMeuItemNome(chat);
        return (
          <ChatCard
            handleSelect={() => selectChat(chat)}
            key={chat.id}
            item={itemNome}
            idMatch={chat.match_id}
            usuarios={chat.usuarios}
            lastMessage={chat.ultimaMensagem}
            isMatchFinalizado={chat.isMatchFinalizado}
          />
        );
      })}
    </section>
  );
};

export default ScrollListChats;
