import {Config} from "@config";

export class PostgreDB {
  public get host(): string {
    return Config.DATABASE.HOST;
  }

  public get port(): number {
    return Config.DATABASE.PORT;
  }

  public get user(): string {
    return Config.DATABASE.USERNAME;
  }

  public get password(): string {
    return Config.DATABASE.PASSWORD;
  }

  public get database(): string {
    return Config.DATABASE.NAME;
  }

  public get type(): string {
    return "postgres";
  }
}
