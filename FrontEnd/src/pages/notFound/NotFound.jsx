import React from "react";
import { Link } from "react-router-dom";
import style from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={style.not_found_container}>
      <span>📦</span>
      <div className={style.shadow} />
      <div className={style.text_container}>
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <Link to="/">
          <h3>Voltar para Home</h3>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
