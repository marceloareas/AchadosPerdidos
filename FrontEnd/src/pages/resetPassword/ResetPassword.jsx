import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import Api from "../../api/Api";
import { useNotification } from "../../utils/NotificationContext";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Captura o ?token=... da URL
  
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica de frontend
    if (novaSenha !== confirmarSenha) {
      showNotification("As senhas não coincidem!", "error");
      return;
    }

    if (novaSenha.length < 6) {
      showNotification("A senha deve ter pelo menos 6 caracteres.", "warning");
      return;
    }

    setLoading(true);

    try {
      // Chamada para o endpoint que criamos no AuthController
      const response = await Api.post("/auth/reset-password", {
        token: token,
        novaSenha: novaSenha
      });

      showNotification("Senha alterada com sucesso! Você já pode fazer login.", "success");
      
      // Redireciona para o login após o sucesso
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erro ao redefinir senha. O link pode ter expirado.";
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Se por algum motivo o usuário entrar na página sem token
  if (!token) {
    return (
      <Container maxWidth="xs">
        <Box sx={{ mt: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error">Link Inválido</Typography>
            <Typography sx={{ mt: 2 }}>Não encontramos um token de recuperação.</Typography>
            <Button onClick={() => navigate("/login")} sx={{ mt: 2 }}>Voltar ao Login</Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={3} sx={{ padding: 4, width: "100%", borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Nova Senha
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Crie uma senha forte e fácil de lembrar.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="novaSenha"
              label="Nova Senha"
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmarSenha"
              label="Confirmar Nova Senha"
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 45 }}
              disabled={loading || !novaSenha || !confirmarSenha}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Atualizar Senha"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;