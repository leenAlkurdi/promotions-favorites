import { AuditAction } from "../enums";

export type AuditEvent = {
    id: string;
    userId: string;
    promotionId: string;
    action: AuditAction;
    timestamp: string;
}