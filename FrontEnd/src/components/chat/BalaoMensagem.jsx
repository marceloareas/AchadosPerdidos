import style from "./Chat.module.scss";

const BalaoMensagem = ({ conteudo, otherUserId, isFirst, isLast }) => {
  const userClassname =
    conteudo.remetenteId === otherUserId ? style.them : style.userMe;
  return (
    <div className={style.balao}>
      <section
        className={`${userClassname}  ${isFirst ? style.first : ""} ${
          isLast ? style.last : ""
        }`}
      >
        <p>{conteudo.conteudo}</p>
      </section>
    </div>
  );
};

export default BalaoMensagem;
