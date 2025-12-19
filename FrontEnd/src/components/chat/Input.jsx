import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaFileImage } from "react-icons/fa";
import dayjs from "dayjs";
import useChatStore from "../../store/chat";

const Input = ({ chat, currentUserId, otherUserId, isMatchFinalizado }) => {
  const textRef = useRef(null);
  const fileRef = useRef(null);

  const [mensagem, setMensagem] = useState("");
  const [btnAtivo, setBtnAtivo] = useState(false);

  const { addMensagem, addMensagemImagem, getChats } = useChatStore();

  const remetenteId = currentUserId;
  const destinatarioId = otherUserId;

  const convertDate = (date) =>
    dayjs(date).format("YYYY-MM-DDTHH:mm:ss");

  const handleSendMessage = async () => {
    if (!btnAtivo || isMatchFinalizado) return;

    await addMensagem(
      {
        remetenteId,
        destinatarioId,
        conteudo: mensagem,
        tipo: "TEXTO",
        dataEnvio: convertDate(new Date()),
      },
      chat.id
    );

    await getChats();
    setMensagem("");
    setBtnAtivo(false);
    textRef.current.style.height = "auto";
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || isMatchFinalizado) return;

    await addMensagemImagem(
      file,
      chat.id,
      remetenteId,
      destinatarioId
    );

    await getChats();
    e.target.value = "";
  };

  useEffect(() => {
    const el = textRef.current;
    const resize = () => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };
    el.addEventListener("input", resize);
    return () => el.removeEventListener("input", resize);
  }, []);

  return (
    <div style={styles.container}>
      <button
        onClick={() => fileRef.current.click()}
        disabled={isMatchFinalizado}
        style={styles.iconBtn}
      >
        <FaFileImage />
      </button>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileRef}
        onChange={handleSendImage}
      />

      <textarea
        ref={textRef}
        disabled={isMatchFinalizado}
        placeholder={
          isMatchFinalizado ? "Match finalizado" : "Mensagem..."
        }
        value={mensagem}
        onChange={(e) => {
          setMensagem(e.target.value);
          setBtnAtivo(e.target.value.trim() !== "");
        }}
        style={styles.textarea}
      />

      <button
        onClick={handleSendMessage}
        disabled={!btnAtivo}
        style={{
          ...styles.iconBtn,
          opacity: btnAtivo ? 1 : 0.4,
        }}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderTop: "1px solid #ddd",
    gap: "8px",
  },
  textarea: {
    flex: 1,
    resize: "none",
    borderRadius: "8px",
    padding: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
};

export default Input;