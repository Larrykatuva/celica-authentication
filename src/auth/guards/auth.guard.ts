import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const {
      headers: { authorization },
    } = request;
    if (!authorization)
      throw new UnauthorizedException('No authorization was provided');
    const token = authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid authorization token');
    try {
      request['user'] = this.jwtService.verify(token, {
        secret: this.configService.get<string>('PRIVATE_KEY'),
      });
    } catch (error) {
      if (error['message']) throw new UnauthorizedException(error.message);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
