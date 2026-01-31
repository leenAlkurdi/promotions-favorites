import { AuditAction } from "../enums";

export type AuditEvent = {
    id: string;
    userId: string;
    promotionId: string;
    action: AuditAction;
    traceId?: string;
    timestamp: string;
}