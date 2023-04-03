import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';
import {
  GRANT_TYPE,
  RESPONSE_TYPE,
} from '../../shared/interfaces/auth.interfaces';
import { IsNotEmpty } from '@nestjs/class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}

export class GrantCodeDto {
  @ApiProperty({ enum: GRANT_TYPE })
  @IsNotEmpty()
  grant_type: GRANT_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  redirect_uri: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}

export class CodeTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty()
  @IsNotEmpty()
  redirect_uri: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  active: boolean;
}

export class VerifyToken {
  @ApiProperty()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty()
  @IsNotEmpty()
  token: string;
}

export class AppTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty()
  @IsNotEmpty()
  redirect_uri: string;
}
