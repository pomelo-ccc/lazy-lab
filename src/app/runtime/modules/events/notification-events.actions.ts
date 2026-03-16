import { Injectable } from '@angular/core';

import { RuntimeEvent } from '../../core/event-contract';
import { EventPayloadMapFromMethods, EventResultMapFromMethods } from '../../type/event-type-helpers';

interface SendNotificationPayload {
  readonly userId: string;
  readonly message: string;
}

interface MarkAsReadPayload {
  readonly notificationId: string;
}

type SendNotificationEvent = RuntimeEvent<SendNotificationPayload>;
type MarkAsReadEvent = RuntimeEvent<MarkAsReadPayload>;

/**
 * 通知事件 — 纯内存操作，注册为同步事件，调用方无需等待异步加载。
 */
@Injectable({ providedIn: 'root' })
export class NotificationEventsActions {
  sendNotification(event: SendNotificationEvent): void {
    console.log(`[Notification] 发送给 ${event.userId}：${event.message}`);
  }

  markAsRead(event: MarkAsReadEvent): void {
    console.log(`[Notification] 标记已读 ${event.notificationId}`);
  }
}

// ─── 局部 map 片段 ────────────────────────────────────────────────────────────

export type NotificationEventPayloadMap = EventPayloadMapFromMethods<NotificationEventsActions>;

export type NotificationEventResultMap = EventResultMapFromMethods<NotificationEventsActions>;
