import { Injector } from '@angular/core';

import { EventManifestEntry } from '../../core/event-registry';
import { EVENT_ID } from '../../type/event-id';

import { domainEntries } from './event-manifest.utils';

export function createCustomerEventManifest(injector: Injector): ReadonlyArray<EventManifestEntry> {
  return domainEntries(
    () => import('../../modules/events/customer-events.actions').then(m => m.CustomerEventsActions),
    injector,
    [
      EVENT_ID.viewCustomer,
      EVENT_ID.updateCustomerTag,
    ]
  );
}
