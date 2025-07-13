import {Injectable} from "@nestjs/common";
import {User} from "@entity";
import {UserRepository} from "@repository";
import {PasswordGateway} from "@gateways";
import z from "zod";

const createUserSchema = z.object({
  name: z
    .string({message: "Nome é obrigatório"})
    .min(1, "Nome deve ter pelo menos 1 caractere"),
  email: z.string({message: "Email é obrigatório"}).email("Email inválido"),
  password: z
    .string({message: "Senha é obrigatória"})
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordGateway: PasswordGateway,
  ) {}

  async execute(
    item: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Partial<User>> {
    const parsedData = createUserSchema.parse(item);

    const existingUser = await this.userRepository.getByEmail(parsedData.email);
    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    const hashedPassword = await this.passwordGateway.hash(parsedData.password);

    const user = await this.userRepository.create({
      name: parsedData.name,
      email: parsedData.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
