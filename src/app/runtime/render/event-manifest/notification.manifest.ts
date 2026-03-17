import { Injector } from '@angular/core';

import { SyncEventManifestEntry } from '../../core/event-registry';
import { EVENT_ID } from '../../type/event-id';
import { NotificationEventsActions } from '../../modules/events/notification-events.actions';

import { syncEntry } from './event-manifest.utils';

export function createNotificationSyncEventManifest(
  injector: Injector
): ReadonlyArray<SyncEventManifestEntry> {
  const notification = injector.get(NotificationEventsActions);

  return [
    syncEntry(EVENT_ID.sendNotification, notification, 'sendNotification'),
    syncEntry(EVENT_ID.markAsRead,       notification, 'markAsRead'),
  ];
}
