import {NestMiddleware, UnauthorizedException} from "@nestjs/common";
import {Request, Response, NextFunction} from "express";
import {JwtGateway} from "@gateway";

export class AuthMiddleware implements NestMiddleware {
  private readonly jwtGateway = new JwtGateway();

  use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException("Token de autenticação não fornecido");
    }

    if (!this.jwtGateway.validate(token)) {
      throw new UnauthorizedException("Token de autenticação inválido");
    }

    const decoded = this.jwtGateway.decode(token);
    req["user"] = decoded;

    next();
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return null;
    }

    return token;
  }
}
