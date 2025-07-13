import {Config} from "@config";
import Redis from "ioredis";

export class RedisConnection {
  /**
   * client
   */
  public client(): Redis {
    return new Redis({
      host: Config.REDIS.HOST,
      port: Config.REDIS.PORT,
      username: Config.REDIS.USERNAME,
      password: Config.REDIS.PASSWORD,
      db: Config.REDIS.DB,
    });
  }
}
