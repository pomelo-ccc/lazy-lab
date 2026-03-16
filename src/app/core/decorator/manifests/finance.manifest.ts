import { defer, map } from 'rxjs';

import { COMPONENT_ID } from '../../../shared/component-ids';
import { LazyManifestEntry } from './lazy-manifest-entry';

export const FINANCE_LAZY_MANIFEST: ReadonlyArray<LazyManifestEntry> = [
  {
    id: COMPONENT_ID.financeList,
    loader: () =>
      defer(() => import('../../../widgets/finance/finance-list-widget.component')).pipe(
        map((m) => m.FinanceListWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.financeAvatar,
    loader: () =>
      defer(() => import('../../../widgets/finance/finance-avatar-widget.component')).pipe(
        map((m) => m.FinanceAvatarWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.financeCollapse,
    loader: () =>
      defer(() => import('../../../widgets/finance/finance-collapse-widget.component')).pipe(
        map((m) => m.FinanceCollapseWidgetComponent)
      )
  }
];
