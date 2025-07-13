"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Modal,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { z } from "zod";
import { useLoginUsuario as useLoginUser, useCreateUsuario as useCreateUser } from "@/api/hooks";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [createData, setCreateData] = useState({ name: "", email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");
  
  const router = useRouter();
  const loginUser = useLoginUser();
  const createUser = useCreateUser();

  const handleLogin = () => {
    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    loginUser.mutate(loginData, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        router.push("/painel");
      },
      onError: () => setError("Erro ao fazer login"),
    });
  };

  const handleCreateUser = () => {
    const result = createUserSchema.safeParse(createData);
    if (!result.success) {
      setCreateError(result.error.issues[0].message);
      return;
    }

    createUser.mutate(createData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setCreateData({ name: "", email: "", password: "" });
        setCreateError("");
      },
      onError: () => setCreateError("Erro ao criar usuário"),
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ccc",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#FFF",
            padding: 4,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" color="#000000" fontWeight="bold">
              Login
            </Typography>
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => {
                setLoginData(prev => ({ ...prev, email: e.target.value }));
                setError("");
              }}
              margin="normal"
              disabled={loginUser.isLoading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={loginData.password}
              onChange={(e) => {
                setLoginData(prev => ({ ...prev, password: e.target.value }));
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              margin="normal"
              disabled={loginUser.isLoading}
              sx={{ mb: 2 }}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loginUser.isLoading}
              sx={{
                backgroundColor: "#000000",
                color: "#FFF",
                padding: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#333333" },
                "&:disabled": { backgroundColor: "#666666" },
              }}
            >
              {loginUser.isLoading ? "Fazendo login..." : "ENTRAR"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setIsModalOpen(true)}
              disabled={loginUser.isLoading}
              sx={{
                mt: 2,
                borderColor: "#000000",
                color: "#000000",
                padding: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": { borderColor: "#333333", backgroundColor: "#f5f5f5" },
                "&:disabled": { borderColor: "#666666", color: "#666666" },
              }}
            >
              CRIAR USUÁRIO
            </Button>
          </Box>
        </Paper>
      </Container>


      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          sx={{
            backgroundColor: "#FFF",
            padding: 4,
            borderRadius: 2,
            width: "90%",
            maxWidth: 500,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Criar Usuário
            </Typography>
            <IconButton onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Nome"
              value={createData.name}
              onChange={(e) => {
                setCreateData(prev => ({ ...prev, name: e.target.value }));
                setCreateError("");
              }}
              margin="normal"
              disabled={createUser.isLoading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={createData.email}
              onChange={(e) => {
                setCreateData(prev => ({ ...prev, email: e.target.value }));
                setCreateError("");
              }}
              margin="normal"
              disabled={createUser.isLoading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={createData.password}
              onChange={(e) => {
                setCreateData(prev => ({ ...prev, password: e.target.value }));
                setCreateError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCreateUser()}
              margin="normal"
              disabled={createUser.isLoading}
              sx={{ mb: 2 }}
            />

            {createError && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {createError}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateUser}
              disabled={createUser.isLoading}
              sx={{
                backgroundColor: "#000000",
                color: "#FFF",
                padding: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#333333" },
                "&:disabled": { backgroundColor: "#666666" },
              }}
            >
              {createUser.isLoading ? "Criando usuário..." : "CRIAR USUÁRIO"}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default LoginPage;
