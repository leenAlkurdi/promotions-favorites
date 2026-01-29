import { ErrorCode } from '../enums';

/*
  Standard API response shape for all endpoints
  Used by both backend and frontend for type safety
 */
export type ApiResponse<T> = {
    //HTTP status code
    statusCode: number;

    //Human-readable message
    message: string;

    //Response payload (null on error)
    data: T | null;

    //Error code for frontend handling and i18n
    errorCode?: ErrorCode;

    //Unique request ID for logging and debugging
    traceId: string;
};
