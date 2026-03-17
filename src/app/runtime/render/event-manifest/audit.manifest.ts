import { Injector } from '@angular/core';

import { SyncEventManifestEntry } from '../../core/event-registry';
import { EVENT_ID } from '../../type/event-id';
import { AuditEventsActions } from '../../modules/events/audit-events.actions';

import { syncEntry } from './event-manifest.utils';

export function createAuditSyncEventManifest(
  injector: Injector
): ReadonlyArray<SyncEventManifestEntry> {
  const audit = injector.get(AuditEventsActions);

  return [
    syncEntry(EVENT_ID.logAuditEvent, audit, 'logAuditEvent'),
  ];
}
