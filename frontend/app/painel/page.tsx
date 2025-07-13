"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  Modal,
  TextField,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  ExitToApp as ExitIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { z } from "zod";
import {
  useCreateUsuario,
  useGetAllUsuarios,
  useGetUsuarioById,
  useUpdateUsuario,
  useDeleteUsuario,
} from "@/api/hooks";

const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const editUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

interface UserToken {
  userId: number;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

const PainelPage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserToken | null>(null);
  const [modalType, setModalType] = useState<
    "create" | "edit" | "search" | null
  >(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [searchId, setSearchId] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  const createUser = useCreateUsuario();
  const updateUser = useUpdateUsuario();
  const deleteUser = useDeleteUsuario();
  const { data: allUsers, isLoading: loadingUsers } = useGetAllUsuarios();
  const { data: searchedUser, isLoading: loadingSearch } = useGetUsuarioById(
    Number(searchId)
  );


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as UserToken;
      setCurrentUser({
        userId: payload.userId || 0,
        email: payload.email || "",
        name: payload.name || "Usuário",
        exp: payload.exp || 0,
        iat: payload.iat || 0,
      });
    } catch {
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [router]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };


  const handleSubmit = () => {
    if (modalType === "create") {
      const result = createUserSchema.safeParse(formData);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }

      createUser.mutate(formData, {
        onSuccess: () => {
          setSuccess("Usuário criado com sucesso!");
          closeModal();
        },
        onError: () => setError("Erro ao criar usuário"),
      });
    } else if (modalType === "edit" && editingUserId) {
      const editData = { name: formData.name, email: formData.email };
      const result = editUserSchema.safeParse(editData);
      
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
      
      updateUser.mutate({ id: editingUserId, data: editData }, {
        onSuccess: () => {
          setSuccess("Usuário atualizado com sucesso!");
          closeModal();
        },
        onError: () => setError("Erro ao atualizar usuário"),
      });
    }
  };
  

  const handleDelete = (user: { id: number; name: string }) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id, {
        onSuccess: () => {
          setSuccess("Usuário deletado com sucesso!");
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        },
        onError: () => {
          setError("Erro ao deletar usuário");
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const openModal = (
    type: "create" | "edit" | "search",
    user?: { id: number; name: string; email: string }
  ) => {
    setModalType(type);
    setError("");
    setSuccess("");

    if (type === "create") {
      setFormData({ name: "", email: "", password: "" });
    } else if (type === "edit" && user) {
      setFormData({ name: user.name, email: user.email, password: "" });
      setEditingUserId(user.id);
    } else if (type === "search") {
      setSearchId("");
    }
  };

  const closeModal = () => {
    setModalType(null);
    setFormData({ name: "", email: "", password: "" });
    setEditingUserId(null);
    setError("");
  };

  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Bem-vindo, {currentUser.name}!
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<ExitIcon />}
          onClick={handleLogout}
        >
          Sair
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AddIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Criar Usuário</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => openModal("create")}
              >
                Criar Novo Usuário
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SearchIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Buscar Usuário</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => openModal("search")}
              >
                Buscar por ID
              </Button>
            </CardContent>
          </Card>
        </Grid>


        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Todos os Usuários</Typography>
              </Box>

              {loadingUsers ? (
                <Typography>Carregando usuários...</Typography>
              ) : (
                <List>
                  {allUsers?.map((user) => (
                    <div key={user.id}>
                      <ListItem
                        secondaryAction={
                          <Box>
                            <IconButton onClick={() => openModal("edit", user)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete({ id: user.id, name: user.name })}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={user.name}
                          secondary={`${user.email} • ID: ${user.id}`}
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Modal
        open={!!modalType}
        onClose={closeModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper sx={{ p: 4, maxWidth: 500, width: "90%" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6">
              {modalType === "create" && "Criar Usuário"}
              {modalType === "edit" && "Editar Usuário"}
              {modalType === "search" && "Buscar Usuário"}
            </Typography>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {modalType === "search" ? (
            <Box>
              <TextField
                fullWidth
                label="ID do Usuário"
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                sx={{ mb: 2 }}
              />

              {loadingSearch && <Typography>Buscando...</Typography>}

              {searchedUser && (
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{searchedUser.name}</Typography>
                    <Typography color="text.secondary">
                      {searchedUser.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      ID: {searchedUser.id}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          ) : (
            <Box>
              <TextField
                fullWidth
                label="Nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                sx={{ mb: 2 }}
              />

              {modalType === "create" && (
                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={createUser.isLoading || updateUser.isLoading}
              >
                {modalType === "create" ? "Criar" : "Atualizar"}
              </Button>
            </Box>
          )}
        </Paper>
      </Modal>


      <Modal
        open={deleteConfirmOpen}
        onClose={cancelDelete}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center"}}
      >
        <Paper sx={{ p: 4, maxWidth: 400, borderRadius: 5 }}>
          <Box textAlign="center">
            <Typography variant="h6" mb={2}>
              Confirmar Exclusão
            </Typography>
            <Typography variant="body1" mb={3}>
              Tem certeza que deseja deletar o usuário{" "}
              <strong>{userToDelete?.name}</strong>?
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={cancelDelete}
                disabled={deleteUser.isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmDelete}
                disabled={deleteUser.isLoading}
              >
                {deleteUser.isLoading ? "Deletando..." : "Deletar"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default PainelPage;
