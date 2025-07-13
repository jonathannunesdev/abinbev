import {NestModule} from "@nestjs/common";
import {AppModule, Nest} from "@nestjs";

const Bootstrap = () => {
  Nest(AppModule as unknown as NestModule);
};

Bootstrap();
