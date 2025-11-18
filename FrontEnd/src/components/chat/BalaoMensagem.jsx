import style from "./Chat.module.scss";
import useAuthStore from "../../store/auth";

const BalaoMensagem = ({ conteudo }) => {
  const { user } = useAuthStore.getState();
  console.log(conteudo);
  console.log(user);
  console.log(conteudo.usuario == user.nome);
  return (
    <div className={style.balao}>
      <section
        className={conteudo.usuario == user.nome ? style.userMe : style.them}
      >
        <p>{conteudo.conteudo}</p>
      </section>
    </div>
  );
};

export default BalaoMensagem;
