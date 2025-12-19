import { useEffect, useRef, useState } from "react";
import style from "./Chat.module.scss";
import dayjs from "dayjs";
import { FaPaperPlane, FaFileImage } from "react-icons/fa";
import useChatStore from "../../store/chat";

const Input = ({ chat, currentUserId, otherUserId, isMatchFinalizado }) => {
  const textRef = useRef(null);
  const [mensagem, setMensagem] = useState("");
  const { addMensagem, getChats } = useChatStore();
  const [btnAtivo, setBtnAtivo] = useState(false);
  const remetenteId = currentUserId;
  const destinatarioId = otherUserId;

  const convertDate = (date) => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  };

  const handleSendMessage = async () => {
    if (!btnAtivo) return;

    const formMessage = {
      remetenteId,
      destinatarioId,
      conteudo: mensagem,
      tipo: "TEXTO",
      dataEnvio: convertDate(new Date()),
    };
    await addMensagem(formMessage, chat.id);
    await getChats();
    setMensagem("");
    setBtnAtivo(false);
    const el = textRef.current;
    if (el) {
      el.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
          disabled={isMatchFinalizado}
          onKeyDown={handleKeyDown}
          ref={textRef}
          rows={1}
          placeholder={isMatchFinalizado ? "Match finalizado.":"Mensagem..."}
          className={style.inputMessage}
          onChange={(e) => {
            const value = e.target.value;
            setMensagem(value);

            if (value.replaceAll(`\n`, "").trim() === "") {
              setBtnAtivo(false);
            } else {
              setBtnAtivo(true);
            }
          }}
          value={mensagem}
        />
      </div>
      <button
        onClick={() => handleSendMessage()}
        className={btnAtivo ? style.iconSendMessage : style.iconDesativado}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default Input;
