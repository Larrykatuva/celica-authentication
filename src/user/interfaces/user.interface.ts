import { USER } from '../../shared/interfaces/auth.interfaces';

export interface RequestUser {
  email: string;
  firstName: string;
  lastName: string;
  sub: string;
  app: string;
  type: USER;
}
