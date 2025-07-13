import { DeleteUserUseCase } from './deleteUser.usecase';

describe('DeleteUserUseCase', () => {
  let deleteUser: DeleteUserUseCase;
  let userRepo: any;

  beforeEach(() => {
    userRepo = {
      getById: jest.fn(),
      delete: jest.fn(),
    };
    deleteUser = new DeleteUserUseCase(userRepo);
  });

  it('should delete user successfully', async () => {
    userRepo.getById.mockResolvedValue({ id: 1, name: 'jonathan' });
    userRepo.delete.mockResolvedValue(undefined);

    const result = await deleteUser.execute(1);

    expect(result.message).toBe('Usuário removido com sucesso');
    expect(userRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should fail when user not found', async () => {
    userRepo.getById.mockResolvedValue(null);

    await expect(deleteUser.execute(999)).rejects.toThrow('Usuário não encontrado');
  });
}); 