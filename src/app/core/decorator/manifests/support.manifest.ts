import { defer, map } from 'rxjs';

import { COMPONENT_ID } from '../../../shared/component-ids';
import { LazyManifestEntry } from './lazy-manifest-entry';

export const SUPPORT_LAZY_MANIFEST: ReadonlyArray<LazyManifestEntry> = [
  {
    id: COMPONENT_ID.supportEmpty,
    loader: () =>
      defer(() => import('../../../widgets/support/support-empty-widget.component')).pipe(
        map((m) => m.SupportEmptyWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.supportProgress,
    loader: () =>
      defer(() => import('../../../widgets/support/support-progress-widget.component')).pipe(
        map((m) => m.SupportProgressWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.supportTimeline,
    loader: () =>
      defer(() => import('../../../widgets/support/support-timeline-widget.component')).pipe(
        map((m) => m.SupportTimelineWidgetComponent)
      )
  }
];
