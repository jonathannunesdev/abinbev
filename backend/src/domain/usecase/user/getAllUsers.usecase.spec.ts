import { GetAllUsersUseCase } from './getAllUsers.usecase';

describe('GetAllUsersUseCase', () => {
  let getAllUsers: GetAllUsersUseCase;
  let userRepo: any;

  beforeEach(() => {
    userRepo = { getAll: jest.fn() };
    getAllUsers = new GetAllUsersUseCase(userRepo);
  });

  it('should return all users', async () => {
    const users = [
      { id: 1, name: 'jonathan', email: 'jonathan@abi.com' },
      { id: 2, name: 'Maria', email: 'maria@abi.com' },
    ];

    userRepo.getAll.mockResolvedValue(users);

    const result = await getAllUsers.execute();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('jonathan');
    expect(result[1].name).toBe('Maria');
  });

  it('should return empty array when no users', async () => {
    userRepo.getAll.mockResolvedValue([]);

    const result = await getAllUsers.execute();

    expect(result).toEqual([]);
  });
}); 