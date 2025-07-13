import {IPasswordGateway} from "@core";
import * as bcrypt from "bcrypt";

export class PasswordGateway implements IPasswordGateway {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
