import { Injector } from '@angular/core';
import { defer, map } from 'rxjs';

import { EventHandler } from '../../core/event-contract';
import { EventManifestEntry } from '../../core/event-registry';
import { EVENT_ID, EventId } from '../../type/event-id';

const path = () => import('../../features/user-profile/user-profile-viewed.event');

export function createUserProfileLazyEventManifest(
  injector: Injector
): ReadonlyArray<EventManifestEntry> {
  return [
    {
      id: EVENT_ID.userProfileViewed,
      loader: () =>
        defer(path).pipe(
          map((module) => module.userProfileViewedEvent as unknown as EventHandler<EventId>)
        )
    }
  ];
}
