import { Injector } from '@angular/core';

import { EventManifestEntry } from '../../core/event-registry';
import { EVENT_ID } from '../../type/event-id';

import { domainEntries } from './event-manifest.utils';

export function createTableEventManifest(injector: Injector): ReadonlyArray<EventManifestEntry> {
  return domainEntries(
    () => import('../../modules/events/table-events.actions').then(m => m.TableEventsActions),
    injector,
    [
      EVENT_ID.reloadTable,
      EVENT_ID.exportRows,
      EVENT_ID.archiveRows,
      EVENT_ID.printRows,
      EVENT_ID.batchDelete,
    ]
  );
}
