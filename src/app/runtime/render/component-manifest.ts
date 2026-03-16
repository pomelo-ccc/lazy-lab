import { defer, map } from 'rxjs';

import { ComponentManifestEntry } from '../core/component-registry';
import { COMPONENT_ID } from '../type/component-id';

export const RUNTIME_COMPONENT_MANIFEST: ReadonlyArray<ComponentManifestEntry> = [
  {
    id: COMPONENT_ID.runtimeTable,
    loader: () =>
      defer(() => import('../modules/table/p-table.component')).pipe(
        map((module) => module.PTableComponent)
      )
  },
  {
    id: COMPONENT_ID.runtimeToolbar,
    loader: () =>
      defer(() => import('../modules/toolbar/p-toolbar.component')).pipe(
        map((module) => module.PToolbarComponent)
      )
  },
  {
    id: COMPONENT_ID.runtimeButton,
    loader: () =>
      defer(() => import('../modules/button/p-button.component')).pipe(
        map((module) => module.PButtonComponent)
      )
  },
  {
    id: COMPONENT_ID.userProfileCard,
    loader: () =>
      defer(() => import('../features/user-profile/user-profile-card.component')).pipe(
        map((module) => module.UserProfileCardComponent)
      )
  }
];
