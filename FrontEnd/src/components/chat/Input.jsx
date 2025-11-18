import style from "./Chat.module.scss";
import { FaPaperPlane } from "react-icons/fa";

const Input = () => {
  return (
    <div className={style.wrapInputChat}>
      <input placeholder="Mensagem..." className={style.inputMessage} />
      <button className={style.iconSendMessage}>
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default Input;
