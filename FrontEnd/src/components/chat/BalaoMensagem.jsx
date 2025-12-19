const BalaoMensagem = ({ conteudo, otherUserId }) => {
  const isOtherUser = conteudo.remetenteId === otherUserId;

  const containerStyle = {
    display: "flex",
    justifyContent: isOtherUser ? "flex-start" : "flex-end",
    marginBottom: "8px",
  };

  const bubbleStyle = {
    maxWidth: "60%",
    padding: "10px",
    borderRadius: "12px",
    backgroundColor: isOtherUser ? "#f1f1f1" : "#DCF8C6",
    wordBreak: "break-word",
  };

  const imageStyle = {
    maxWidth: "100%",
    borderRadius: "8px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={bubbleStyle}>
        {conteudo.tipo === "TEXTO" && (
          <p style={{ margin: 0 }}>{conteudo.conteudo}</p>
        )}

        {conteudo.tipo === "IMAGEM" && (
          <img
            src={conteudo.conteudo}
            alt="imagem enviada"
            style={imageStyle}
            onClick={() => window.open(conteudo.conteudo, "_blank")}
          />
        )}
      </div>
    </div>
  );
};

export default BalaoMensagem;
