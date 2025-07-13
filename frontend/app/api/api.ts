import axios, { AxiosResponse } from "axios";
import {
  CreateUserData,
  LoginData,
  LoginResponse,
  UpdateUserData,
  User,
} from "@/types/types";


const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



const api = {
  loginUsuario: async (data: LoginData): Promise<LoginResponse> => {
    const result: AxiosResponse<{ data: LoginResponse }> = await http.post(
      "/auth/login",
      data
    );
    return result.data.data;
  },

  createUsuario: async (data: CreateUserData): Promise<User> => {
    const result: AxiosResponse<{ data: User }> = await http.post("/users", data);
    return result.data.data;
  },

  getAllUsuarios: async (): Promise<User[]> => {
    const result: AxiosResponse<{ data: User[] }> = await http.get("/users");
    return result.data.data;
  },

  getUsuarioById: async (id: number): Promise<User> => {
    const result: AxiosResponse<{ data: User }> = await http.get(`/users/${id}`);
    return result.data.data;
  },

  updateUsuario: async (
    id: number,
    data: UpdateUserData
  ): Promise<User> => {
    const result: AxiosResponse<{ data: User }> = await http.put(
      `/users/${id}`,
      data
    );
    return result.data.data;
  },

  deleteUsuario: async (id: number): Promise<void> => {
    await http.delete(`/users/${id}`);
  },
};

export default api;

