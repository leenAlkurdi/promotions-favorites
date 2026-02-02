import { ErrorCode } from "@promotions-favorites/shared";

type Mapped = { key: string; params?: Record<string, any> };

export function mapErrorToI18n(err: any): Mapped {
  const code = err?.errorCode ?? err?.code ?? "BAD_REQUEST";
  switch (code) {
    case ErrorCode.UNAUTHORIZED:
      return { key: "errors.UNAUTHORIZED" };
    case ErrorCode.FORBIDDEN:
      return { key: "errors.FORBIDDEN" };
    case ErrorCode.NOT_FOUND:
      return { key: "errors.NOT_FOUND" };
    case ErrorCode.PROMOTION_EXPIRED:
      return { key: "errors.PROMOTION_EXPIRED" };
    default:
      return { key: "errors.GENERIC", params: { message: err?.message } };
  }
}

export default mapErrorToI18n;
