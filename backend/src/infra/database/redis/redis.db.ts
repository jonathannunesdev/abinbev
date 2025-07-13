import {Config} from "@config";

export class RedisDBConnection {
  get user() {
    return `${Config.REDIS.USERNAME}`;
  }

  get password() {
    return `${Config.REDIS.PASSWORD}`;
  }

  get type() {
    return `redis`;
  }

  get port(): number {
    return Config.REDIS.PORT;
  }

  get host(): string {
    return `${Config.REDIS.HOST}`;
  }

  get db(): number {
    return Config.REDIS.DB;
  }
}
