import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

// Criação do Contexto de Notificação
const NotificationContext = createContext();

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};
// Provider de Notificação
export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false); // Controle de exibição do Snackbar
  const [message, setMessage] = useState(""); // Mensagem da notificação
  const [severity, setSeverity] = useState(""); // Tipo de severidade (info, success, error, etc.)

  const showNotification = (msg, severity) => {
    setMessage(msg);
    setSeverity(severity);
    setOpen(true);
  };

  const closeNotification = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {/* Snackbar para exibir notificações */}
      <Snackbar
        open={open}
        autoHideDuration={3000} // Duração antes de desaparecer
        onClose={closeNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        key={SlideTransition.name}
      >
        <Alert
          onClose={closeNotification}
          variant="filled"
          severity={severity}
          sx={{ width: "60%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook para usar as notificações
export const useNotification = () => useContext(NotificationContext);
