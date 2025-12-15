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
import ProtectedRoute from "./utils/protectedRoute/protectedRoute";
import HomeOrLanding from "./utils/HomeOrLanding";

function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<HomeOrLanding />} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/itens" element={<ProtectedRoute><MeusItens /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
