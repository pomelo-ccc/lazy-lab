import { EventHandlerResult, RuntimeEvent } from '../core/event-contract';

export type ExtractEventPayload<T> =
  T extends (event: infer TEvent) => any
    ? Omit<TEvent & RuntimeEvent<object>, keyof RuntimeEvent<object>>
    : never;

export type ExtractEventResult<T> =
  T extends (...args: any[]) => EventHandlerResult<infer TResult> ? TResult : never;

export type EventPayloadMapFromMethods<TMethods extends object> = {
  [K in keyof TMethods]: ExtractEventPayload<TMethods[K]>
};

export type EventResultMapFromMethods<TMethods extends object> = {
  [K in keyof TMethods]: ExtractEventResult<TMethods[K]>
};
