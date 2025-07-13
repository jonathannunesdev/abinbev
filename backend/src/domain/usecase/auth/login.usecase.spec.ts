import { LoginUseCase } from './login.usecase';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepo: any;
  let jwt: any;
  let password: any;

  beforeEach(() => {
    userRepo = { getByEmail: jest.fn() };
    jwt = { generate: jest.fn() };
    password = { compare: jest.fn() };

    loginUseCase = new LoginUseCase(userRepo, jwt, password);
  });

  it('should login successfully', async () => {
    const user = {
      id: 1,
      name: 'jonathan',
      email: 'jonathan@abi.com',
      password: 'hashed123',
    };

    userRepo.getByEmail.mockResolvedValue(user);
    password.compare.mockResolvedValue(true);
    jwt.generate.mockReturnValue('jwt-token');

    const result = await loginUseCase.execute({
      email: 'jonathan@abi.com',
      password: '123456',
    });

    expect(result.token).toBe('jwt-token');
    expect(result.user.id).toBe(1);
    expect(result.user.name).toBe('jonathan');
  });

  it('should fail with wrong credentials', async () => {
    userRepo.getByEmail.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'wrong@email.com',
        password: '123456',
      })
    ).rejects.toThrow('Credenciais inválidas');
  });

  it('should fail with wrong password', async () => {
    userRepo.getByEmail.mockResolvedValue({
      id: 1,
      password: 'hashed123',
    });
    password.compare.mockResolvedValue(false);

    await expect(
      loginUseCase.execute({
        email: 'jonathan@abi.com',
        password: 'wrong-password',
      })
    ).rejects.toThrow('Credenciais inválidas');
  });
}); 