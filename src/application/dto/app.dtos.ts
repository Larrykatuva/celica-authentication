import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from '@nestjs/class-validator';
import { CLIENT_TYPE } from '../../shared/interfaces/auth.interfaces';

export class RegisterAppDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: CLIENT_TYPE })
  @IsNotEmpty()
  clientType: CLIENT_TYPE;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  redirectUri: string[];

  @ApiProperty()
  logo: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  acceptLegalTerms: boolean;
}

export class AppResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  clientType: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  acceptLegalTerms: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
