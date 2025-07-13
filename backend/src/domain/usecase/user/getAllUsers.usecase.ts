import {Injectable} from "@nestjs/common";
import {UserRepository} from "@repository";
import {UserDto} from "@usecases";

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.getAll();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
