// src/utils/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import { createWebSocketClient } from "./config/WebSocket_config";
import useAuthStore from "../store/auth"; // Importamos o vigia global!

const NotificationContext = createContext();

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  
  const [novaMensagem, setNovaMensagem] = useState(null); 
  const [clientAtivo, setClientAtivo] = useState(null);

  // 1. O Contexto agora "escuta" o token em tempo real. Se você logar, ele percebe na hora!
  const { token } = useAuthStore();

  const showNotification = (msg, severity) => {
    setMessage(msg);
    setSeverity(severity);
    setOpen(true);
  };

  const closeNotification = () => {
    setOpen(false);
  };
  console.log("🚨 O PROVIDER NOVO ESTÁ NA ÁREA! Token atual:", token);
  useEffect(() => {
    console.log("🔄 Verificando permissão para ligar o STOMP...", token ? "Token OK" : "Sem Token");

    // 2. Trava de segurança (se fizer logout ou não tiver logado ainda)
    if (!token) {
      console.log("❌ STOMP Pausado: Usuário não está logado.");
      return;
    }

    console.log("🚀 Iniciando conexão STOMP...");

    // 3. Inicia o cliente com o token novo
    const client = createWebSocketClient(token);

    client.onConnect = () => {
      console.log("✅ STOMP: Conectado com sucesso!");
      
      client.subscribe("/user/queue/messages", (message) => {
        const mensagemRecebida = JSON.parse(message.body);
        console.log("🔔 STOMP: Nova mensagem recebida: ", mensagemRecebida);
        setNovaMensagem(mensagemRecebida);
        showNotification("Você recebeu uma nova mensagem!", "info"); 
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP Erro Crítico: ", frame.headers["message"]);
    };

    client.onWebSocketError = (event) => {
        console.error("❌ STOMP Erro Físico (CORS ou Porta): ", event);
    }

    client.activate();
    setClientAtivo(client);

    return () => {
      console.log("🛑 STOMP: Desconectando...");
      client.deactivate();
      setClientAtivo(null);
    };
  }, [token]); // <-- O SEGREDO MÁGICO: Ele re-executa toda vez que o 'token' mudar (Login/Logout)

  return (
    <NotificationContext.Provider value={{ showNotification, novaMensagem, setNovaMensagem, clientAtivo }}>
      <Snackbar
        open={open}
        autoHideDuration={3000} 
        onClose={closeNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        key={SlideTransition.name}
      >
        <Alert onClose={closeNotification} variant="filled" severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);