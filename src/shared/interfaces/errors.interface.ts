import { ApiProperty } from '@nestjs/swagger';
/**
 * Forbidden response
 */
export class ForbiddenResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string[];
}

/**
 * Bad request response
 */
export class BadRequestResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string[];
}
