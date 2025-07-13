import { CreateUserUseCase } from './createUser.usecase';

describe('CreateUserUseCase', () => {
  let createUser: CreateUserUseCase;
  let userRepo: any;
  let passwordGateway: any;

  beforeEach(() => {
    userRepo = {
      getByEmail: jest.fn(),
      create: jest.fn(),
    };

    passwordGateway = {
      hash: jest.fn(),
    };

    createUser = new CreateUserUseCase(userRepo, passwordGateway);
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'jonathan',
      email: 'jonathan@abi.com',
      password: '123456',
    };

    userRepo.getByEmail.mockResolvedValue(null);
    passwordGateway.hash.mockResolvedValue('hashed123');
    userRepo.create.mockResolvedValue({
      id: 1,
      ...userData,
      password: 'hashed123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createUser.execute(userData);

    expect(result.id).toBe(1);
    expect(result.name).toBe('jonathan');
    expect(result.email).toBe('jonathan@abi.com');
    expect(result.password).toBeUndefined();
  });

  it('should fail if email already exists', async () => {
    userRepo.getByEmail.mockResolvedValue({ id: 1, email: 'jonathan@abi.com' });

    await expect(
      createUser.execute({
        name: 'jonathan',
        email: 'jonathan@abi.com',
        password: '123456',
      })
    ).rejects.toThrow('Email já está em uso');
  });

  it('should fail with invalid data', async () => {
    await expect(
      createUser.execute({
        name: '',
        email: 'invalid-email',
        password: '123',
      })
    ).rejects.toThrow();
  });
}); 