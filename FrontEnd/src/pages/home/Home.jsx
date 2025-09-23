import React from "react";
import Layout from "../../components/layout/Layout";
import style from "./Home.module.scss";
import { FiPlus } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

const Home = () => {
  return (
    <Layout>
      <section className={style.section_home_above}>
        <h1>Achados e Perdidos</h1>
        <h2>CEFET/RJ - Campus Maracanã</h2>
        <button className={style.btn_home}>
          <FiPlus className={style.icon_plus_btn_home} />
          <div className={style.text_btn_home}>
            <h3> Cadastrar Item Perdido</h3>
            <h5> Perdeu algo? Cadastre aqui</h5>
          </div>
        </button>
        <button className={style.btn_home}>
          <FaSearch className={style.icon_search_btn_home} />
          <div className={style.text_btn_home}>
            <h3> Cadastrar Item Encontrado</h3>
            <h5> Achou algo? Cadastre aqui</h5>
          </div>
        </button>
      </section>
      <section className={style.section_home_below}>
        <h3>Ultimos itens devolvidos</h3>
      </section>
    </Layout>
  );
};

export default Home;
