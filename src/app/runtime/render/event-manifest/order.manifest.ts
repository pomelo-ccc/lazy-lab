import { Injector } from '@angular/core';

import { EventManifestEntry } from '../../core/event-registry';
import { EVENT_ID } from '../../type/event-id';

import { domainEntries } from './event-manifest.utils';

export function createOrderEventManifest(injector: Injector): ReadonlyArray<EventManifestEntry> {
  return domainEntries(
    () => import('../../modules/events/order-events.actions').then(m => m.OrderEventsActions),
    injector,
    [
      EVENT_ID.createOrder,
      EVENT_ID.cancelOrder,
      EVENT_ID.confirmOrder,
      EVENT_ID.shipOrder,
    ]
  );
}
