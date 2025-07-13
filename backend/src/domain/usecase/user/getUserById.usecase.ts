import {Injectable} from "@nestjs/common";
import {UserRepository} from "@repository";
import {UserDto} from "@usecases";

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.getById(id);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
