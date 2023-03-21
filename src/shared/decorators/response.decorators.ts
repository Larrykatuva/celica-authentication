import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  ForbiddenResponse,
} from '../interfaces/errors.interface';

/**
 * Response swagger dto after creating a universal bill.
 * @constructor
 */
export const SharedResponsePipe = (dto: any, status = 201) => {
  return applyDecorators(
    status == 201
      ? ApiCreatedResponse({
          description: 'Successful Request',
          type: dto,
        })
      : ApiOkResponse({
          description: 'Successful Request',
          type: dto,
        }),
    ApiUnauthorizedResponse({
      description: 'Forbidden.',
      type: ForbiddenResponse,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: BadRequestResponse,
    }),
  );
};
