import React from "react";
import style from "./Footer.module.scss";
import {
  FiHome,
  FiCheckCircle,
  FiMessageCircle,
  FiArchive,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const route = useLocation();
  const onNavigate = useNavigate();

  const isHome = route.pathname == "/";
  const isMatches = route.pathname == "/matches";
  const isChat = route.pathname == "/chats";
  const isItens = route.pathname == "/itens";

  return (
    <div className={style.body_footer}>
      <button
        className={
          isHome
            ? `${style.box_icons_footer} ${style.box_icons_footer_current}`
            : style.box_icons_footer
        }
        onClick={() => onNavigate("/")}
      >
        <FiHome className={style.icons_footer} />
        <span className={style.nav_footer}>Home</span>
      </button>
      <button
        className={
          isMatches
            ? `${style.box_icons_footer} ${style.box_icons_footer_current}`
            : style.box_icons_footer
        }
        onClick={() => onNavigate("/matches")}
      >
        <FiCheckCircle className={style.icons_footer} />
        <span className={style.nav_footer}>Matches</span>
      </button>
      <button
        className={
          isChat
            ? `${style.box_icons_footer} ${style.box_icons_footer_current}`
            : style.box_icons_footer
        }
        onClick={() => onNavigate("/chats")}
      >
        <FiMessageCircle className={style.icons_footer} />
        <span className={style.nav_footer}>Chats</span>
      </button>
      <button
        className={
          isItens
            ? `${style.box_icons_footer} ${style.box_icons_footer_current}`
            : style.box_icons_footer
        }
        onClick={() => onNavigate("/itens")}
      >
        <FiArchive className={style.icons_footer} />
        <span className={style.nav_footer}>Itens</span>
      </button>
    </div>
  );
};

export default Footer;
