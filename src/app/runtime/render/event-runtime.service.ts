import { inject, Injectable } from '@angular/core';
import { from, isObservable, map, Observable, of, switchMap } from 'rxjs';

import { ApiProxy } from '../core/api-proxy';
import { EventInvokeRequest, EventInvokeResponse } from '../core/event-contract';

import { RuntimeRegistryService } from './runtime-registry.service';

@Injectable({
  providedIn: 'root'
})
export class EventRuntimeService implements ApiProxy<EventInvokeRequest, EventInvokeResponse> {
  private readonly runtimeRegistry = inject(RuntimeRegistryService);

  execute$<TId extends EventInvokeRequest['eventId']>(
    request: EventInvokeRequest<TId>
  ): Observable<EventInvokeResponse<TId>> {
    return this.runtimeRegistry.resolveEventHandler$(request.eventId).pipe(
      switchMap((handler) => toObservable(handler(request))),
      map((result) => ({
        eventId: request.eventId,
        result,
        context: request.context
      }))
    );
  }

  dispatch$<TId extends EventInvokeRequest['eventId']>(
    request: EventInvokeRequest<TId>
  ): Observable<EventInvokeResponse<TId>> {
    return this.execute$(request);
  }
}

function toObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(value)) {
    return value;
  }

  if (value instanceof Promise) {
    return from(value);
  }

  return of(value);
}
