import { Injector } from '@angular/core';

import { EventManifestEntry } from '../../core/event-registry';
import { EVENT_ID } from '../../type/event-id';

import { domainEntries } from './event-manifest.utils';

export function createProductEventManifest(injector: Injector): ReadonlyArray<EventManifestEntry> {
  return domainEntries(
    () => import('../../modules/events/product-events.actions').then(m => m.ProductEventsActions),
    injector,
    [
      EVENT_ID.publishProduct,
      EVENT_ID.unpublishProduct,
      EVENT_ID.adjustPrice,
    ]
  );
}
