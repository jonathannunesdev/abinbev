export interface IJwtGateway {
  generate(payload: any): string;
  validate(token: string): boolean;
  decode(token: string): any;
}
