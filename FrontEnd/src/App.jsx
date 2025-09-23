import { useState } from "react";
import ReactDom from "react-dom";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Matches from "./pages/matches/Matches";
import MeusItens from "./pages/meusItens/MeusItens";
import Chats from "./pages/chats/Chats";
import NotFound from "./pages/notFound/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/itens" element={<MeusItens />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
