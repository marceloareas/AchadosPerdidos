import { useState, useEffect } from "react";
import style from "./Chat.module.scss";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Typography, Box } from "@mui/material";

const HeaderChat = ({ item, usuario, onBack }) => {
  // Responsividade
  const [windowWidth, setWidth] = useState(window.innerWidth);
  const sizePage = windowWidth > 600 ? false : true;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section className={style.headerChat}>
      <div className={style.iconBackListChats}>
        {sizePage && onBack && (
          <IoReturnUpBackOutline
            className={style.back_chats}
            size={45}
            onClick={onBack}
          />
        )}
      </div>
      <div className={style.info}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
        >
          {item}
        </Typography>
        <Typography
          // className={style.horarioLastMessage}
          sx={{
            color: "#706d6db2",
            fontSize: "0.9rem",
          }}
        >
          {usuario}
        </Typography>
      </div>
    </section>
  );
};

export default HeaderChat;
