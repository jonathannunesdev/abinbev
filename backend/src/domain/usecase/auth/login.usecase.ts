import {Injectable} from "@nestjs/common";
import {UserRepository} from "@repository";
import {JwtGateway, PasswordGateway} from "@gateways";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export interface LoginResult {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtGateway: JwtGateway,
    private readonly passwordGateway: PasswordGateway,
  ) {}

  async execute(loginData: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    const parsedData = loginSchema.parse(loginData);

    const user = await this.userRepository.getByEmail(parsedData.email);

    if (
      !user ||
      !(await this.passwordGateway.compare(parsedData.password, user.password))
    ) {
      throw new Error("Credenciais inválidas");
    }

    const token = this.jwtGateway.generate({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
