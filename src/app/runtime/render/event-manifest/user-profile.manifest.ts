import { Injector } from '@angular/core';
import { defer, map } from 'rxjs';

import { EventHandler } from '../../core/event-contract';
import { EventManifestEntry } from '../../core/event-registry';
import { EVENT_ID, EventId } from '../../type/event-id';

export function createUserProfileEventManifest(injector: Injector): ReadonlyArray<EventManifestEntry> {
  return [
    {
      id: EVENT_ID.userProfileViewed,
      loader: () =>
        defer(() => import('../../features/user-profile/user-profile-viewed.event')).pipe(
          map((module) => module.userProfileViewedEvent as unknown as EventHandler<EventId>)
        )
    }
  ];
}
