import {Response} from "express";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Delete,
  Param,
  Res,
} from "@nestjs/common";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Public} from "@shared/decorators";
import {
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from "@usecases";

@Controller("users")
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @ApiOperation({summary: "Listar todos os usuários"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de usuários",
    type: [UserDto],
  })
  async getUsers(@Res() res: Response): Promise<Response> {
    try {
      const users = await this.getAllUsersUseCase.execute();
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: users,
      });
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Erro interno do servidor",
      });
    }
  }

  @Get(":id")
  @ApiOperation({summary: "Buscar usuário por ID"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Usuário encontrado",
    type: UserDto,
  })
  async getUserById(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user = await this.getUserByIdUseCase.execute(parseInt(id));

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: HttpStatus.NOT_FOUND,
          message: "Usuário não encontrado",
        });
      }

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: user,
      });
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Erro interno do servidor",
      });
    }
  }

  @Post()
  @Public()
  @ApiOperation({summary: "Criar usuário"})
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Usuário criado com sucesso",
    type: CreateUserDto,
  })
  async createUser(
    @Body() userData: any,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const userCreated = await this.createUserUseCase.execute(userData);

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        data: userCreated,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Email já está em uso") {
          return res.status(HttpStatus.CONFLICT).json({
            status: HttpStatus.CONFLICT,
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

  @Put(":id")
  @ApiOperation({summary: "Atualizar usuário"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Usuário atualizado com sucesso",
    type: UpdateUserDto,
  })
  async updateUser(
    @Param("id") id: string,
    @Body() userData: any,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedUser = await this.updateUserUseCase.execute(
        parseInt(id),
        userData,
      );

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Usuário não encontrado") {
          return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            message: error.message,
          });
        }
        if (error.message === "Email já está em uso") {
          return res.status(HttpStatus.CONFLICT).json({
            status: HttpStatus.CONFLICT,
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

  @Delete(":id")
  @ApiOperation({summary: "Remover usuário"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Usuário removido com sucesso",
    type: String,
  })
  async deleteUser(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.deleteUserUseCase.execute(parseInt(id));

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: result.message,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Usuário não encontrado") {
          return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            message: error.message,
          });
        }
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Erro interno do servidor",
      });
    }
  }
}
