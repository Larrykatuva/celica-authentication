import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Exception filter for catching all http exceptions and uniforming it to a common response body structure.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse = exception.getResponse();
    let message: any = ['An error occurred'];
    if (errorResponse.hasOwnProperty('message')) {
      if (!Array.isArray(errorResponse['message'])) {
        message = [errorResponse['message']];
      } else {
        message = errorResponse['message'];
      }
    } else if (typeof errorResponse === 'string') {
      message = [errorResponse];
    } else if (errorResponse.hasOwnProperty('errors')) {
      message = [Object.values(errorResponse['errors']).toString()];
    } else {
      const newMessage: string[] = [];
      if (typeof errorResponse == 'object') {
        const data = Object.entries(errorResponse);
        for (let i = 0; i < data.length; i++) {
          if (Array.isArray(data[i][1])) {
            newMessage.push(`${data[i][1]}`);
          } else {
            newMessage.push(data[i][1]);
          }
        }
        message = newMessage;
      }
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}

/**
 * Resource not found custom exception.
 */
export class ResourceNotFoundException extends HttpException {
  constructor(resource?: string) {
    super(
      `${resource ? resource : 'Resource'} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Resource forbidden custom exception.
 */
export class ResourceForbiddenException extends HttpException {
  constructor(message?: string) {
    super(`${message ? message : 'Forbidden'}`, HttpStatus.FORBIDDEN);
  }
}
