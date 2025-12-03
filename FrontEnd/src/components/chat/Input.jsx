import { useEffect, useRef } from "react";
import style from "./Chat.module.scss";
import { FaPaperPlane, FaFileImage } from "react-icons/fa";
import useChatStore from "../../store/chat";

const Input = ({ chat, currentUserId }) => {
  const textRef = useRef(null);
  const [mensagem, setMensagem] = useState("");
  const { sendMessage } = useChatStore();

  const remetenteId = currentUserId;
  const destinatarioId = chat?.usuarios?.find(
    (u) => u.id !== currentUserId
  )?.id;

  const handleSendMessage = async () => {
    const formMessage = {
      remetenteId,
      destinatarioId,
      conteudo: mensagem,
      tipo: "TEXTO",
    };
    if (!mensagem.trim) return;
    await sendMessage(formMessage, chat.id);
    setMensagem("");
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
          onChange={(e) => e.target.value}
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
