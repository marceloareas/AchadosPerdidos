import { useEffect, useRef } from "react";
import style from "./Chat.module.scss";
import { FaPaperPlane, FaFileImage } from "react-icons/fa";

const Input = () => {
  const textRef = useRef(null);

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
        />
      </div>
      <button className={style.iconSendMessage}>
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default Input;
