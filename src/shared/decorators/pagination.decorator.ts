import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ExtractPagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const {
      query: { skip = 0, limit = 0 },
    } = request;
    return {
      skip: skip,
      limit: limit,
    };
  },
);
