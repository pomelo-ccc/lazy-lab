import { EventHandler, RuntimeEvent } from '../../core/event-contract';
import { EVENT_ID } from '../../type/event-id';

export interface UserProfileViewedPayload {
  readonly userId: string;
  readonly source: 'runtime-demo';
}

export interface UserProfileViewedResult {
  readonly auditId: string;
  readonly handledAt: string;
  readonly message: string;
}

type UserProfileViewedEvent = RuntimeEvent<UserProfileViewedPayload>;

export const userProfileViewedEvent: EventHandler<
  typeof EVENT_ID.userProfileViewed,
  UserProfileViewedPayload,
  UserProfileViewedResult
> = (request) => {
  const event = {
    ...(request.payload as UserProfileViewedPayload),
    context: request.context
  } as UserProfileViewedEvent;

  return {
    auditId: `audit-${event.context.requestId}`,
    handledAt: event.context.timestamp,
    message: `runtime 已处理 userId=${event.userId} 的查看事件，来源=${event.source}。`
  };
};

export interface UserProfileEventPayloadMap {
  [EVENT_ID.userProfileViewed]: UserProfileViewedPayload;
}

export interface UserProfileEventResultMap {
  [EVENT_ID.userProfileViewed]: UserProfileViewedResult;
}
