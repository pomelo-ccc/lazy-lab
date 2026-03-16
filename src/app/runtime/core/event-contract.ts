import { Observable } from 'rxjs';

import { EventId } from '../type/event-id';
import { EventPayloadMap, EventResultMap } from '../type/event-contract-map/index';

import { RuntimeContext } from './runtime-context';

export interface RuntimeBaseEvent {
  readonly context: RuntimeContext;
  readonly beans?: unknown;
}

export type RuntimeEvent<TPayload extends object = Record<string, never>> =
  TPayload & RuntimeBaseEvent;

export interface EventInvokeRequest<
  TId extends EventId = EventId,
  TPayload = EventPayloadMap[TId]
> {
  readonly eventId: TId;
  readonly payload: TPayload;
  readonly context: RuntimeContext;
}

export interface EventInvokeResponse<TId extends EventId = EventId> {
  readonly eventId: TId;
  readonly result: EventResultMap[TId];
  readonly context: RuntimeContext;
}

export type EventHandlerResult<TResult> = TResult | Observable<TResult>;

export type EventHandler<
  TId extends EventId = EventId,
  TPayload = EventPayloadMap[TId],
  TResult = EventResultMap[TId]
> = (
  request: EventInvokeRequest<TId, TPayload>
) => EventHandlerResult<TResult>;
