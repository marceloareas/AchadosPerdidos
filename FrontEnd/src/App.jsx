import { useEffect, useState } from "react";
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
import useAuthStore from "./store/auth";
import { useNavigate } from "react-router-dom";
import webSocketService from "./utils/config/WebSocket_config";
import Api from "./api/Api";

function App() {

  const { token, logout } = useAuthStore();
  const onNavigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Criamos uma função assíncrona interna
    const verifyToken = async () => {
      console.log("🔍 VERIFICAÇÃO PADRÃO: TOKEN VÁLIDO?");

      // Se não tem token, paramos o loading e deixamos o fluxo seguir 
      // (As ProtectedRoutes vão barrar o acesso se necessário)
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // 2. Usamos AWAIT para esperar a resposta
        // Nota: Enviar { token } como objeto JSON é mais padrão que enviar a string pura
        const response = await Api.post("/auth/validateToken", token); 
        
        // console.log("Resposta API:", response);
        
        // Assumindo que seu backend retorna true/false diretamente no body
        const isTokenValid = response.data.data; 

        if (!isTokenValid) {
          throw new Error("Token inválido segundo o backend");
        }

        console.log("✅ TOKEN VÁLIDO");
        webSocketService.connectWebSocket();

      } catch (error) {
        console.warn("🚫 Token inválido ou erro na requisição. Realizando LOGOUT.");
        // console.error(error);
        
        webSocketService.disconnect(); // Garante desconexão
        logout(); // Limpa store
        navigate("/login"); // Redireciona
      } finally {
        // 4. Finaliza o carregamento independente do resultado
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []); // Executa apenas na montagem
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
