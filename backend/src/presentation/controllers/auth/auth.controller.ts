import {Response} from "express";
import {Body, Controller, HttpStatus, Post, Res} from "@nestjs/common";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Public} from "@shared/decorators";
import {LoginUseCase} from "@usecases";

interface LoginDto {
  email: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @Public()
  @ApiOperation({summary: "Login de usuário"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Login realizado com sucesso",
  })
  async login(
    @Body() loginData: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.loginUseCase.execute(loginData);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Credenciais inválidas") {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            status: HttpStatus.UNAUTHORIZED,
            message: error.message,
          });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Erro interno do servidor",
      });
    }
  }
}
