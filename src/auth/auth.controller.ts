import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AppTokenDto,
  CodeTokenDto,
  GrantCodeDto,
  RegisterUserDto,
  UserResponseDto,
  VerifyToken,
} from './dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SharedResponse } from '../shared/decorators/response.decorators';
import { GRANT_TYPE, USER } from '../shared/interfaces/auth.interfaces';
import { AppService } from '../application/services/app.service';
import { GrantCodeService } from '../application/services/grantCode.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private appService: AppService,
    private grantCodeService: GrantCodeService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  @Post('user/register')
  @SharedResponse(UserResponseDto)
  async registerUser(@Body() user: RegisterUserDto): Promise<UserResponseDto> {
    return await this.authService.registerUser(user);
  }

  @Post('authorize')
  @HttpCode(200)
  async getAuthorizationCode(
    @Body() data: GrantCodeDto,
  ): Promise<{ code: string }> {
    switch (data.grant_type) {
      case GRANT_TYPE.password: {
        const app = await this.appService.filterApp({
          clientId: data.client_id,
        });
        if (!app) throw new BadRequestException('Invalid client_id');
        if (!app.redirectUri.split(',').includes(data.redirect_uri))
          throw new BadRequestException('Invalid redirect_uri');
        return await this.authService.generateGrantCode(
          app,
          data.email,
          data.password,
        );
      }
      default: {
        throw new BadRequestException('Invalid grant_type');
      }
    }
  }

  @Post('token')
  @HttpCode(200)
  @SharedResponse(undefined)
  async getUserToken(@Body() data: CodeTokenDto): Promise<any> {
    const app = await this.appService.filterApp({
      clientId: data.client_id,
    });
    if (!app) throw new BadRequestException('Invalid client_id');
    if (app.clientSecret != data.client_secret)
      throw new BadRequestException('Invalid client_secret');
    if (!app.redirectUri.split(',').includes(data.redirect_uri))
      throw new BadRequestException('Invalid redirect_uri');
    const grantCode = await this.grantCodeService.redeemGrantCode({
      code: data.code,
    });
    if (
      grantCode.app.clientSecret != data.client_secret ||
      grantCode.app.clientId != data.client_id
    )
      throw new UnauthorizedException('Authentication failed');
    const payload = {
      email: grantCode.user.email,
      firstName: grantCode.user.firstName,
      lastName: grantCode.user.lastName,
      sub: grantCode.user.id,
      app: grantCode.app.name,
      type: USER.USER,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '36000s',
        secret: this.configService.get<string>('PRIVATE_KEY'),
      }),
      token_type: 'Bearer',
      scope: 'token',
      state: grantCode.state,
      expires_in: '10hr',
      type: USER.USER,
    };
  }

  @Post('introspect')
  @HttpCode(200)
  async verifyToken(@Body() data: VerifyToken): Promise<any> {
    const app = await this.appService.filterApp({
      clientId: data.client_id,
    });
    if (!app) throw new BadRequestException('Invalid client_id');
    if (app.clientSecret != data.client_secret)
      throw new BadRequestException('Invalid client_secret');
    try {
      const active = this.jwtService.verify(data.token, {
        secret: this.configService.get<string>('PRIVATE_KEY'),
      });
      return {
        active: true,
        iat: active.iat,
        exp: active.exp,
        type: active.type,
      };
    } catch (error) {
      if (error['message']) throw new UnauthorizedException(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('userinfo')
  @HttpCode(200)
  async getUserInfo(@Body() data: VerifyToken): Promise<any> {
    const app = await this.appService.filterApp({
      clientId: data.client_id,
    });
    if (!app) throw new BadRequestException('Invalid client_id');
    if (app.clientSecret != data.client_secret)
      throw new BadRequestException('Invalid client_secret');
    try {
      return this.jwtService.verify(data.token, {
        secret: this.configService.get<string>('PRIVATE_KEY'),
      });
    } catch (error) {
      if (error['message']) throw new UnauthorizedException(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('app-token')
  @HttpCode(200)
  async getAppToken(@Body() data: AppTokenDto): Promise<any> {
    const app = await this.appService.filterApp({
      clientId: data.client_id,
    });
    if (!app) throw new BadRequestException('Invalid client_id');
    if (app.clientSecret != data.client_secret)
      throw new BadRequestException('Invalid client_secret');
    if (!app.redirectUri.split(',').includes(data.redirect_uri))
      throw new BadRequestException('Invalid redirect_uri');
    const payload = {
      name: app.name,
      description: app.description,
      type: USER.APP,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '36000s',
        secret: this.configService.get<string>('PRIVATE_KEY'),
      }),
      token_type: 'Bearer',
      scope: 'token',
      expires_in: '10hr',
      type: USER.APP,
    };
  }
}
