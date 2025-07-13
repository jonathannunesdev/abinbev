import { UpdateUserUseCase } from './updateUser.usecase';

describe('UpdateUserUseCase', () => {
  let updateUser: UpdateUserUseCase;
  let userRepo: any;

  beforeEach(() => {
    userRepo = {
      getById: jest.fn(),
      getByEmail: jest.fn(),
      update: jest.fn(),
    };
    updateUser = new UpdateUserUseCase(userRepo);
  });

  it('should update user successfully', async () => {
    const existingUser = { id: 1, name: 'jonathan', email: 'jonathan@email.com' };
    const updatedUser = { id: 1, name: 'jonathan nunes', email: 'jonathan@email.com' };

    userRepo.getById.mockResolvedValue(existingUser);
    userRepo.update.mockResolvedValue(updatedUser);

    const result = await updateUser.execute(1, { name: 'jonathan nunes' });

    expect(result.name).toBe('jonathan nunes');
    expect(userRepo.update).toHaveBeenCalledWith(1, { name: 'jonathan nunes' });
  });

  it('should fail when user not found', async () => {
    userRepo.getById.mockResolvedValue(null);

    await expect(
      updateUser.execute(999, { name: 'jonathan nunes' })
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('should fail when email already taken', async () => {
    userRepo.getById.mockResolvedValue({ id: 1, email: 'jonathan@email.com' });
    userRepo.getByEmail.mockResolvedValue({ id: 2, email: 'maria@email.com' });

    await expect(
      updateUser.execute(1, { email: 'maria@email.com' })
    ).rejects.toThrow('Email já está em uso');
  });
}); 