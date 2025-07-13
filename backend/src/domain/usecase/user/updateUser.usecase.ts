import {Injectable} from "@nestjs/common";
import {User} from "@entity";
import {UserRepository} from "@repository";
import z from "zod";
import {UserDto} from "@usecases";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: number,
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<UserDto> {
    const parsedData = updateUserSchema.parse(userData);

    const existingUser = await this.userRepository.getById(id);
    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    if (parsedData.email && parsedData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.getByEmail(
        parsedData.email,
      );
      if (userWithEmail) {
        throw new Error("Email já está em uso");
      }
    }

    const updatedUser = await this.userRepository.update(id, parsedData);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
