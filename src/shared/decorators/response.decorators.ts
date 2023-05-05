import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  ForbiddenResponse,
} from '../interfaces/errors.interface';
import { CommonResponseDto } from '../dtos/shared.dto';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { ApiNoContentResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

/**
 * Response swagger dto after creating a universal bill.
 * @constructor
 */
export const SharedResponse = (dto: any, status = 201) => {
  return applyDecorators(
    status == 201
      ? ApiCreatedResponse({
          description: 'Successful Request',
          type: dto,
        })
      : status == 204
      ? ApiNoContentResponse({
          description: 'No Content',
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

/**
 * Shared paginated response pipe which receives a generic body dto
 * @param dto
 * @constructor
 */
export const SharedPaginatedResponse = <T extends Type<any>>(dto: T) => {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto, dto),
    ApiOkResponse({
      description: 'Successful request',
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dto) },
              },
            },
          },
        ],
      },
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

/**
 * Common pagination decorator which applies all decorators related to pagination.
 * @param dto
 * @constructor
 */
export const RequestPaginationDecorator = <T extends Type<any>>(dto: T) => {
  return applyDecorators(
    ApiQuery({ name: 'skip', type: 'number', required: false }),
    ApiQuery({ name: 'take', type: 'number', required: false }),
    SharedPaginatedResponse(dto),
    UseInterceptors(PaginationInterceptor),
  );
};
