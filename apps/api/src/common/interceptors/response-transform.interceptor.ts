import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '@promotions-favorites/shared';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const traceId = request.traceId || 'unknown-trace-id';

    return next.handle().pipe(
      map((data: unknown) => {
        if (
          data &&
          typeof data === 'object' &&
          'statusCode' in (data as Record<string, unknown>) &&
          'traceId' in (data as Record<string, unknown>)
        ) {
          return data;
        }

        const payload: ApiResponse<unknown> = {
          statusCode: response.statusCode || 200,
          message: 'Success',
          data: data ?? null,
          traceId,
        };

        return payload;
      }),
    );
  }
}
