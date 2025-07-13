import {User} from "@entity";
import {IRepository} from "./repository.contract";

export interface IUserRepository extends IRepository<User> {
  getByEmail(email: string): Promise<User | null>;
}
