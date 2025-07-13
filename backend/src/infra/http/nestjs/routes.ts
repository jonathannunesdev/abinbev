import {RequestMethod} from "@nestjs/common";

export const PUBLIC_ROUTES = [
  {path: "/users", method: RequestMethod.POST},
  {path: "/auth/login", method: RequestMethod.POST},
];
