export interface LoggedUser {
  email: string;
  firstName: string;
  lastName: string;
  sub: string;
  app: string;
  type: string;
  iat: number;
  exp: number;
}
