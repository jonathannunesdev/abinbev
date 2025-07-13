import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';

export const useLoginUsuario = () => {
    return useMutation({
        mutationFn: api.loginUsuario,
    });
};

export const useCreateUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createUsuario,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useGetAllUsuarios = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: api.getAllUsuarios,
        staleTime: 2 * 60 * 1000, 
    });
};

export const useGetUsuarioById = (id: number) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => api.getUsuarioById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, 
    });
};

export const useUpdateUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name?: string; email?: string; password?: string } }) => 
            api.updateUsuario(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        },
    });
};

export const useDeleteUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteUsuario,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.removeQueries({ queryKey: ['user', deletedId] });
        },
    });
}; 