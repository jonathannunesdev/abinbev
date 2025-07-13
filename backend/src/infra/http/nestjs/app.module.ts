import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import * as Controllers from "@controllers";
import {AuthMiddleware} from "@middleware";
import {PUBLIC_ROUTES} from "./routes";
import {UserRepository} from "@repository";
import {JwtGateway, PasswordGateway} from "@gateways";
import {
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  LoginUseCase,
} from "@usecases";

@Module({
  imports: [],
  controllers: [...Object.values(Controllers)],
  providers: [
    UserRepository,
    JwtGateway,
    PasswordGateway,
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    LoginUseCase,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...PUBLIC_ROUTES)
      .forRoutes("*");
  }
}
