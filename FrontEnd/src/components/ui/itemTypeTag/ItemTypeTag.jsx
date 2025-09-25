import React from "react";
import style from "./ItemTypeTag.module.scss";

const ItemTypeTag = ({ type }) => {
  const isLost = type === "lost";
  return (
    <div className={`${style.badge} ${isLost ? style.lost : style.found}`}>
      {isLost ? "Item Perdido" : "Item Encontrado"}
      {/* colocar pra item devolvido depois */}
    </div>
  );
};

export default ItemTypeTag;
