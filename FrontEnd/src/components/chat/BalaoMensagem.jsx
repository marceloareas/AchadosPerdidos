import { useState } from "react";
// O import do SCSS continua aqui, mas não vamos usar ele nesse teste.
import style from "./Chat.module.scss";

const BalaoMensagem = ({ conteudo, otherUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lógica para saber de quem é a mensagem
  const isMine = String(conteudo.remetenteId) !== String(otherUserId);
  const isImagem = conteudo.tipo === "IMAGEM";
  const urlDaImagem = conteudo.conteudo || conteudo.imageUrl;

  console.log("Testando Mensagem:", {
    tipo: conteudo.tipo,
    remetenteId: conteudo.remetenteId,
    otherUserId: otherUserId,
    isMine: isMine 
  });

  return (
    <>
      {/*
        
      */}
      <div style={{
        display: "flex",
        width: "100%",
        justifyContent: isMine ? "flex-end" : "flex-start", // O flex-end FORÇA ir pra direita
        marginBottom: "10px",
        padding: "0 15px"
      }}>
        <div style={{
          backgroundColor: isMine ? "#124B73" : "#E5E5EA", // Azul escuro e Cinza claro
          color: isMine ? "white" : "black",
          padding: "8px",
          borderRadius: "8px",
          // O limite rígido de tamanho:
          width: isImagem ? "250px" : "fit-content",
          maxWidth: "80%"
        }}>
          {isImagem ? (
            <img
              src={urlDaImagem}
              alt="Anexo do chat"
              onClick={() => setIsModalOpen(true)}
              style={{
                width: "100%", // Preenche os 250px da div pai
                borderRadius: "4px",
                display: "block",
                cursor: "pointer"
              }}
            />
          ) : (
            <p style={{ margin: 0 }}>{conteudo.conteudo}</p>
          )}
        </div>
      </div>

      {/* TELA PRETA DE ZOOM */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 9999,
            cursor: "zoom-out"
          }}
        >
          <img 
            src={urlDaImagem} 
            alt="Zoom" 
            style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain", borderRadius: "8px" }} 
          />
        </div>
      )}
    </>
  );
};

export default BalaoMensagem;