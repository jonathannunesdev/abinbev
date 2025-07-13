import { GetUserByIdUseCase } from './getUserById.usecase';

describe('GetUserByIdUseCase', () => {
  let getUserById: GetUserByIdUseCase;
  let userRepo: any;

  beforeEach(() => {
    userRepo = { getById: jest.fn() };
    getUserById = new GetUserByIdUseCase(userRepo);
  });

  it('should return user when found', async () => {
    const user = { id: 1, name: 'jonathan', email: 'jonathan@abi.com' };
    userRepo.getById.mockResolvedValue(user);

    const result = await getUserById.execute(1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('jonathan');
  });

  it('should return null when user not found', async () => {
    userRepo.getById.mockResolvedValue(null);

    const result = await getUserById.execute(999);

    expect(result).toBeNull();
  });
}); 