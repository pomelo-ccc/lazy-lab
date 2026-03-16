import { Injectable } from '@angular/core';

import { RuntimeEvent } from '../../core/event-contract';
import { EventPayloadMapFromMethods, EventResultMapFromMethods } from '../../type/event-type-helpers';

interface LogAuditEventPayload {
  readonly action: string;
  readonly targetId: string;
}

type LogAuditEvent = RuntimeEvent<LogAuditEventPayload>;

/**
 * 审计事件 — 同步写入本地审计日志，注册为同步事件。
 */
@Injectable({ providedIn: 'root' })
export class AuditEventsActions {
  logAuditEvent(event: LogAuditEvent): void {
    console.log(
      `[Audit] action=${event.action}`,
      `target=${event.targetId}`,
      `by=${event.context.source}`,
      `at=${event.context.timestamp}`
    );
  }
}

// ─── 局部 map 片段 ────────────────────────────────────────────────────────────

export type AuditEventPayloadMap = EventPayloadMapFromMethods<AuditEventsActions>;

export type AuditEventResultMap = EventResultMapFromMethods<AuditEventsActions>;
