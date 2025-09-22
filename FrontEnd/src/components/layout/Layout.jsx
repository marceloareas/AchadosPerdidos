import React from "react";
import style from "./Layout.module.scss";
import Footer from "../footer/Footer";
import Header from "../header/Header";
const Layout = ({ children }) => {
  return (
    <div className={style.pagesLayout}>
      <Header />
      <main className={style.contentLayout}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
