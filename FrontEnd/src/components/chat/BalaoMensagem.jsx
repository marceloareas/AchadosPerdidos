import style from "./Chat.module.scss";

const BalaoMensagem = ({ conteudo, currentUserId }) => {
  return (
    <div className={style.balao}>
      <section
        className={conteudo.usuario === currentUserId ? style.userMe : style.them}
      >
        <p>{conteudo.conteudo}</p>
      </section>
    </div>
  );
};

export default BalaoMensagem;
