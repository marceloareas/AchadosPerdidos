import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Api from "../../api/Api";
import { useNotification } from "../../utils/NotificationContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamada para o endpoint criado no AuthController
      const response = await Api.post("/auth/forgot-password", { email });
      
      // O backend retorna mensagem genérica por segurança
      showNotification(response.data.message || "Verifique seu e-mail para o link de recuperação.", "success");
      
      //Redirecionar para o login após alguns segundos ou manter na tela
      setTimeout(() => navigate("/login"), 5000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erro ao solicitar recuperação de senha.";
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={3} sx={{ padding: 4, width: "100%", borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Recuperar Senha
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Digite seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 45 }}
              disabled={loading || !email}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar Link"}
            </Button>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Voltar para o Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;