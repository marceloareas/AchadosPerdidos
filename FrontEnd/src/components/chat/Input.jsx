import { useEffect, useRef, useState } from "react";
import style from "./Chat.module.scss";
import dayjs from "dayjs";
import { FaPaperPlane, FaPaperclip, FaCamera, FaImage } from "react-icons/fa";
import useChatStore from "../../store/chat";
import { uploadImagemChat } from "../../api/Api";

const Input = ({ chat, currentUserId, otherUserId, isMatchFinalizado }) => {
  const textRef = useRef(null);
  const inputGalleryRef = useRef(null); // Ref para Galeria
  const inputCameraRef = useRef(null);   // Ref para Câmera
  const menuRef = useRef(null);         // Ref para fechar o menu ao clicar fora

  const [mensagem, setMensagem] = useState("");
  const [showMenu, setShowMenu] = useState(false); // Controle do menu de anexos
  const { addMensagem, getChats } = useChatStore();
  const [btnAtivo, setBtnAtivo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const remetenteId = currentUserId;
  const destinatarioId = otherUserId;

  const convertDate = (date) => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  };

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setShowMenu(false); // Fecha o menu após selecionar

    try {
      setIsUploading(true);
      const apiResponse = await uploadImagemChat(file);
      const imageUrlGerada = apiResponse.data || apiResponse.url;

      if (!imageUrlGerada) {
        console.error("URL da imagem não encontrada.");
      }

      const formMessage = {
        remetenteId,
        destinatarioId,
        conteudo: imageUrlGerada,
        tipo: "IMAGEM",
        dataEnvio: convertDate(new Date()),
        imageUrl: imageUrlGerada 
      };

      await addMensagem(formMessage, chat.id);
      await getChats();
      
      setMensagem(""); 
      setBtnAtivo(false);
      
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Falha ao enviar a imagem.");
    } finally {
      setIsUploading(false);
      event.target.value = null; 
    }
  };

  const handleSendMessage = async () => {
    if (!btnAtivo || isUploading) return;

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
    if (textRef.current) textRef.current.style.height = "auto";
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
      el.style.height = "auto"; 
      el.style.height = `${el.scrollHeight - 15}px`; 
    };
    el.addEventListener("input", resize);
    return () => el.removeEventListener("input", resize);
  }, []);

  return (
    <div className={style.contentInput}>
      
      {/* Input para Galeria */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputGalleryRef}
        onChange={handleFileChange}
      />

      {/* Input para Câmera Direta */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        ref={inputCameraRef}
        onChange={handleFileChange}
      />

      <div className={style.wrapInputChat} ref={menuRef}>
        
        {/* Menu de Anexos Estilo WhatsApp */}
        {showMenu && (
          <div className={style.attachmentMenu}>
            <button className={style.menuItem} onClick={() => inputCameraRef.current.click()}>
              <div className={style.iconCircleCamera}><FaCamera /></div>
              <span>Câmera</span>
            </button>
            <button className={style.menuItem} onClick={() => inputGalleryRef.current.click()}>
              <div className={style.iconCircleGallery}><FaImage /></div>
              <span>Galeria</span>
            </button>
          </div>
        )}

        <button 
          className={`${style.iconClip} ${showMenu ? style.clipActive : ""}`}
          disabled={isMatchFinalizado || isUploading}
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaPaperclip />
        </button>

        <textarea
          disabled={isMatchFinalizado || isUploading}
          onKeyDown={handleKeyDown}
          ref={textRef}
          rows={1}
          placeholder={isUploading ? "Enviando..." : (isMatchFinalizado ? "Match finalizado." : "Mensagem...")}
          className={style.inputMessage}
          onChange={(e) => {
            const value = e.target.value;
            setMensagem(value);
            setBtnAtivo(value.trim() !== "");
          }}
          value={mensagem}
        />
      </div>

      <button
        onClick={() => handleSendMessage()}
        className={btnAtivo && !isUploading ? style.iconSendMessage : style.iconDesativado}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default Input;