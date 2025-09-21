import React from "react";
import { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUser, FiPlus } from "react-icons/fi";
import logo from "../../assets/logoCefet.svg";
import style from "./Header.module.scss";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [windowWidth, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowWidth > 600) {
    return (
      <>
        <nav id="nav">
          {" "}
          <NavLink> OIIIIII</NavLink>
          <button onClick={() => console.log(windowWidth)}></button>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <div className={style.body_header}>
          <section className={style.left_section_header}>
            <img className={style.logo_header} src={logo} alt="" />
            <span className={style.tittle_header}>A&P</span>
          </section>
          <section className={style.right_section_header}>
            <FiPlus className={style.plus_header} />
            <FiUser className={style.user_header} />
          </section>
        </div>
      </>
    );
  }
};

export default Header;
