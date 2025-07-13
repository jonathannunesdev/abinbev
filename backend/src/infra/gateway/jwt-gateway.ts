import {IJwtGateway} from "@core";
import * as jwt from "jsonwebtoken";
import {Config} from "@config";

export class JwtGateway implements IJwtGateway {
  private readonly secretKey = Config.JWT_SECRET;
  private readonly expiresIn = "24h";

  generate(payload: any): string {
    return jwt.sign(payload, this.secretKey, {expiresIn: this.expiresIn});
  }

  validate(token: string): boolean {
    try {
      jwt.verify(token, this.secretKey);
      return true;
    } catch {
      return false;
    }
  }

  decode(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch {
      return null;
    }
  }
}
