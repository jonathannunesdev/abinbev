import {Injectable} from "@nestjs/common";
import {UserRepository} from "@repository";

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<{message: string}> {
    const existingUser = await this.userRepository.getById(id);
    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    await this.userRepository.delete(id);
    return {message: "Usuário removido com sucesso"};
  }
}
