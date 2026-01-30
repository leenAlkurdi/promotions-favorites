import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
	private readonly logger = new Logger(TraceIdInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest();
		const response = httpContext.getResponse();

		const incomingTraceId = request.headers['x-trace-id'];
		const traceId =
			typeof incomingTraceId === 'string' && incomingTraceId.length > 0
				? incomingTraceId
				: randomUUID();

		request.traceId = traceId;
		response.setHeader('x-trace-id', traceId);

		this.logger.log(
			`Request ${request.method} ${request.url} traceId=${traceId}`,
		);

		return next.handle();
	}
}
