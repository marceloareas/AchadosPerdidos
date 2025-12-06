import style from "./Chat.module.scss";

const BalaoMensagem = ({ conteudo, otherUserId }) => {
  return (
    <div className={style.balao}>
      <section
        className={
          conteudo.remetenteId === otherUserId ? style.them : style.userMe
        }
      >
        <p>{conteudo.conteudo}</p>
      </section>
    </div>
  );
};

export default BalaoMensagem;
