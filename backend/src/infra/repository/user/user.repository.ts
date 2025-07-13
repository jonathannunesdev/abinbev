import {Injectable} from "@nestjs/common";
import {User} from "@entity";
import {UserEntity} from "@orm/entities";
import {PostgreRepository} from "@orm/helpers";
import {IUserRepository} from "@abstract/contracts";
import {RedisCache} from "@infra/cache";

@Injectable()
export class UserRepository implements IUserRepository {
  readonly #postgres = new PostgreRepository();
  readonly redis = new RedisCache();

  async create(
    user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<User> {
    const userRepository = await this.#postgres.getRepository(UserEntity);
    const newUser = userRepository.create({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedUser = await userRepository.save(newUser);

    await this.redis.del(`user:email:${savedUser.email}`);
    await this.redis.del("users:all");

    return this.mapToUser(savedUser);
  }

  async getByEmail(email: string): Promise<User | null> {
    const cacheKey = `user:email:${email}`;

    const cachedUser = await this.redis.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const userRepository = await this.#postgres.getRepository(UserEntity);
    const user = await userRepository.findOne({where: {email}});

    if (user) {
      const mappedUser = this.mapToUser(user);
      await this.redis.set(cacheKey, mappedUser, 300);
      return mappedUser;
    }

    return null;
  }

  async getById(id: number): Promise<User | null> {
    const cacheKey = `user:id:${id}`;

    const cachedUser = await this.redis.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const userRepository = await this.#postgres.getRepository(UserEntity);
    const user = await userRepository.findOne({where: {id}});

    if (user) {
      const mappedUser = this.mapToUser(user);
      await this.redis.set(cacheKey, mappedUser, 300);
      return mappedUser;
    }

    return null;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const userRepository = await this.#postgres.getRepository(UserEntity);
    await userRepository.update(id, {
      ...user,
      updatedAt: new Date(),
    });

    await this.redis.del(`user:id:${id}`);
    await this.redis.del("users:all");

    const updatedUser = await this.getById(id);
    if (!updatedUser) {
      throw new Error("Usuário não encontrado após atualização");
    }
    return updatedUser;
  }

  async getAll(): Promise<User[]> {
    const cacheKey = "users:all";

    const cachedUsers = await this.redis.get<User[]>(cacheKey);
    if (cachedUsers) {
      return cachedUsers;
    }

    const userRepository = await this.#postgres.getRepository(UserEntity);
    const users = await userRepository.find();
    const mappedUsers = users.map((user) => this.mapToUser(user));

    await this.redis.set(cacheKey, mappedUsers, 120);

    return mappedUsers;
  }

  async delete(id: number): Promise<void> {
    const userRepository = await this.#postgres.getRepository(UserEntity);
    await userRepository.delete(id);

    await this.redis.del(`user:id:${id}`);
    await this.redis.del("users:all");
  }

  private mapToUser(userEntity: UserEntity): User {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    };
  }
}
