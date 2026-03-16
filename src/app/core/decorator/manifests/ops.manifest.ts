import { defer, map } from 'rxjs';

import { COMPONENT_ID } from '../../../shared/component-ids';
import { LazyManifestEntry } from './lazy-manifest-entry';

export const OPS_LAZY_MANIFEST: ReadonlyArray<LazyManifestEntry> = [
  {
    id: COMPONENT_ID.opsResult,
    loader: () =>
      defer(() => import('../../../widgets/ops/ops-result-widget.component')).pipe(
        map((m) => m.OpsResultWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.opsDescriptions,
    loader: () =>
      defer(() => import('../../../widgets/ops/ops-descriptions-widget.component')).pipe(
        map((m) => m.OpsDescriptionsWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.opsBadge,
    loader: () =>
      defer(() => import('../../../widgets/ops/ops-badge-widget.component')).pipe(
        map((m) => m.OpsBadgeWidgetComponent)
      )
  }
];
