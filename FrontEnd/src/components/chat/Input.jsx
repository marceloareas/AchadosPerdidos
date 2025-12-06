import { useEffect, useRef, useState } from "react";
import style from "./Chat.module.scss";
import dayjs from "dayjs";
import { FaPaperPlane, FaFileImage } from "react-icons/fa";
import useChatStore from "../../store/chat";

const Input = ({ chat, currentUserId, otherUserId }) => {
  const textRef = useRef(null);
  const [mensagem, setMensagem] = useState("");
  const { addMensagem } = useChatStore();

  const remetenteId = currentUserId;
  const destinatarioId = otherUserId;

  const convertDate = (date) => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  };

  const handleSendMessage = async () => {
    const formMessage = {
      remetenteId,
      destinatarioId,
      conteudo: mensagem,
      tipo: "TEXTO",
      dataEnvio: convertDate(new Date()),
    };
    await addMensagem(formMessage, chat.id);
    setMensagem("".trim());
  };

  useEffect(() => {
    const el = textRef.current;

    const resize = () => {
      el.style.height = "auto"; // reseta a altura
      el.style.height = `${el.scrollHeight - 15}px`; // ajusta à altura do conteúdo
    };

    resize(); // inicia já ajustado

    el.addEventListener("input", resize);
    return () => el.removeEventListener("input", resize);
  }, []);
  return (
    <div className={style.contentInput}>
      <div className={style.wrapInputChat}>
        <button className={style.iconImage}>
          <FaFileImage />
        </button>
        <textarea
          ref={textRef}
          rows={1}
          placeholder="Mensagem..."
          className={style.inputMessage}
          onChange={(e) => setMensagem(e.target.value)}
          value={mensagem}
        />
      </div>
      <button
        onClick={() => handleSendMessage()}
        className={style.iconSendMessage}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default Input;
