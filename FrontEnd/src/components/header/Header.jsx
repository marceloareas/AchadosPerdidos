import React, { useState } from "react";
import { FiUser, FiPlus } from "react-icons/fi";
import logo from "../../assets/logoCefet.svg";
import style from "./Header.module.scss";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import CustomButton from "../ui/button/CustomButton";
import useAuthStore from "../../store/auth";

const Header = () => {
  const route = useLocation();
  const onNavigate = useNavigate();

  const isHome = route.pathname === "/";
  const isMatches = route.pathname === "/matches";
  const isChat = route.pathname === "/chats";
  const isItens = route.pathname === "/itens";

  const { token, logout } = useAuthStore(); 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleMenuClose();
    onNavigate("/login");
  };

  if (!token) {
    return (
      <div className={style.body_header}>
        <section
          className={style.left_section_header}
          onClick={() => onNavigate("/")}
        >
          <img className={style.logo_header} src={logo} alt="" />
          <span className={style.tittle_header}>A&P</span>
        </section>
        <section className={style.right_section_header}>
          <CustomButton
            variant="outline"
            onClick={() => onNavigate("/login")}
          >
            Entrar
          </CustomButton>
        </section>
      </div>
    );
  }

  // Header normal para usuários logados
  return (
    <div className={style.body_header}>
      <section
        className={style.left_section_header}
        onClick={() => onNavigate("/")}
      >
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
        <IconButton onClick={() => onNavigate("/add-item")}>
          <FiPlus className={style.plus_header} />
        </IconButton>
        <IconButton onClick={handleMenuOpen}>
          <FiUser className={style.user_header} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => onNavigate("/profile")}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>SignOut</MenuItem>
        </Menu>
      </section>
    </div>
  );
};

export default Header;
