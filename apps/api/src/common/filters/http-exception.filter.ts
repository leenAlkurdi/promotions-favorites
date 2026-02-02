import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '@promotions-favorites/shared';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private mapStatusToErrorCode(statusCode: number): ErrorCode {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { traceId?: string }>();

    const traceId = request.traceId || 'unknown-trace-id';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode: ErrorCode | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res) {
        const responseObj = res as {
          message?: string | string[];
          errorCode?: ErrorCode;
        };
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
        } else if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        }
        if (responseObj.errorCode) {
          errorCode = responseObj.errorCode;
        }
      }

      if (statusCode === HttpStatus.BAD_REQUEST && !errorCode) {
        errorCode = ErrorCode.VALIDATION_ERROR;
      }

      if (!errorCode) {
        errorCode = this.mapStatusToErrorCode(statusCode);
      }
    }

    if (!errorCode) {
      errorCode = ErrorCode.INTERNAL_ERROR;
    }

    this.logger.error('Request failed', {
      traceId,
      statusCode,
      errorCode,
      path: request.url,
      method: request.method,
    });

    response.status(statusCode).json({
      statusCode,
      message,
      data: null,
      errorCode,
      traceId,
    });
  }
}
