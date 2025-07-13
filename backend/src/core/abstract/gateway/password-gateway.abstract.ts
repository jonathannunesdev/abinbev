export const PASSWORD_GATEWAY = "PASSWORD_GATEWAY";

export interface IPasswordGateway {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
