// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

// Paginas e Layout
import Home from "./pages/home/Home";
import Matches from "./pages/matches/Matches";
import MeusItens from "./pages/meusItens/MeusItens";
import Chats from "./pages/chats/Chats";
import NotFound from "./pages/notFound/NotFound";
import AddItem from "./pages/cadastroItem/AddItem";
import Cadastro from "./pages/cadastro/Cadastro";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";

import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";

import ProtectedRoute from "./utils/protectedRoute/protectedRoute";
import HomeOrLanding from "./utils/HomeOrLanding";
import useAuthStore from "./store/auth";
import Api from "./api/Api";

function App() {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await Api.post("/auth/validateToken", token);
        const isTokenValid = response.data.data;
        if (!isTokenValid) throw new Error("Token inválido");
      } catch (error) {
        logout();
        navigate("/login"); 
      } finally {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, [token, logout, navigate]);

  if (isLoading) {
      return <div>Carregando aplicação...</div>;
  }

  return (
      <Routes>
        <Route path="/" element={<HomeOrLanding />} />
        
        {/* ROTAS DE RECUPERAÇÃO DE SENHA (PÚBLICAS) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/itens"
          element={
            <ProtectedRoute>
              <MeusItens />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
        
        <Route path="/register" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;