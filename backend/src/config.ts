import * as dotenv from "dotenv";
import {join} from "path";

dotenv.config({
  path: join(__dirname, "../", ".env"),
});

export class IConfig {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  DATABASE: {
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
  };
  REDIS: {
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    DB: number;
  };
}

export const Config: IConfig = {
  NODE_ENV: process.env.NODE_ENV || "production",
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  DATABASE: {
    HOST: process.env.DB_HOST ?? "",
    PORT: Number(process.env.DB_PORT),
    USERNAME: process.env.DB_USERNAME ?? "",
    PASSWORD: process.env.DB_PASSWORD ?? "",
    NAME: process.env.DB_NAME ?? "",
  },
  REDIS: {
    HOST: process.env.REDIS_HOST ?? "localhost",
    PORT: Number(process.env.REDIS_PORT) || 6379,
    USERNAME: process.env.REDIS_USERNAME ?? "",
    PASSWORD: process.env.REDIS_PASSWORD ?? "",
    DB: Number(process.env.REDIS_DB) || 0,
  },
};
