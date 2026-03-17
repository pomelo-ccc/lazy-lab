import { COMPONENT_ID } from '../type/component-id';

import { buildLazyComponentManifestEntries } from './component-manifest.utils';

const pathGroup = {
  runtimeShell: {
    [COMPONENT_ID.runtimeTable]: () => import('../modules/table/p-table.component'),
    [COMPONENT_ID.runtimeToolbar]: () => import('../modules/toolbar/p-toolbar.component'),
    [COMPONENT_ID.runtimeButton]: () => import('../modules/button/p-button.component')
  },
  feature: {
    [COMPONENT_ID.userProfileCard]: () =>
      import('../features/user-profile/user-profile-card.component')
  }
} as const;

export const RUNTIME_COMPONENT_MANIFEST = buildLazyComponentManifestEntries(pathGroup);
