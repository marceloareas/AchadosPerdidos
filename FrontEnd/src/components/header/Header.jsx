import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUser, FiPlus } from "react-icons/fi";
import logo from "../../assets/logoCefet.svg";
import style from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const route = useLocation();

  const isHome = route.pathname == "/";
  const isMatches = route.pathname == "/matches";
  const isChat = route.pathname == "/chats";
  const isItens = route.pathname == "/itens";

  return (
    <>
      <div className={style.body_header}>
        <section className={style.left_section_header}>
          <img className={style.logo_header} src={logo} alt="" />
          <span className={style.tittle_header}>A&P</span>
        </section>
        <section className={style.mid_section_header}>
          <div
            className={
              isHome
                ? `${style.box_nav_header} ${style.box_nav_header_current}`
                : style.box_nav_header
            }
          >
            <NavLink
              to="/"
              className={
                isHome
                  ? `${style.nav_header} ${style.nav_header_current}`
                  : style.nav_header
              }
            >
              Home
            </NavLink>
          </div>
          <div
            className={
              isMatches
                ? `${style.box_nav_header} ${style.box_nav_header_current}`
                : style.box_nav_header
            }
          >
            <NavLink
              to="/matches"
              className={
                isMatches
                  ? `${style.nav_header} ${style.nav_header_current}`
                  : style.nav_header
              }
            >
              Matches
            </NavLink>
          </div>
          <div
            className={
              isChat
                ? `${style.box_nav_header} ${style.box_nav_header_current}`
                : style.box_nav_header
            }
          >
            <NavLink
              to="/chats"
              className={
                isChat
                  ? `${style.nav_header} ${style.nav_header_current}`
                  : style.nav_header
              }
            >
              Chats
            </NavLink>
          </div>
          <div
            className={
              isItens
                ? `${style.box_nav_header} ${style.box_nav_header_current}`
                : style.box_nav_header
            }
          >
            <NavLink
              to="/itens"
              className={
                isItens
                  ? `${style.nav_header} ${style.nav_header_current}`
                  : style.nav_header
              }
            >
              Itens
            </NavLink>
          </div>
        </section>
        <section className={style.right_section_header}>
          <FiPlus className={style.plus_header} />
          <FiUser className={style.user_header} />
        </section>
      </div>
    </>
  );
};

export default Header;
