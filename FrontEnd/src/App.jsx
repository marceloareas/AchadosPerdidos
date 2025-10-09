import { useState } from "react";
import ReactDom from "react-dom";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Matches from "./pages/matches/Matches";
import MeusItens from "./pages/meusItens/MeusItens";
import Chats from "./pages/chats/Chats";
import NotFound from "./pages/notFound/NotFound";
import AddItem from "./pages/cadastroItem/AddItem";
import Cadastro from "./pages/cadastro/Cadastro";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/itens" element={<MeusItens />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
