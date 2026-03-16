import { defer, map } from 'rxjs';

import { COMPONENT_ID } from '../../../shared/component-ids';
import { LazyManifestEntry } from './lazy-manifest-entry';

export const SALES_LAZY_MANIFEST: ReadonlyArray<LazyManifestEntry> = [
  {
    id: COMPONENT_ID.salesKpi,
    loader: () =>
      defer(() => import('../../../widgets/sales/sales-kpi-widget.component')).pipe(
        map((m) => m.SalesKpiWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.salesTrend,
    loader: () =>
      defer(() => import('../../../widgets/sales/sales-trend-widget.component')).pipe(
        map((m) => m.SalesTrendWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.salesAlert,
    loader: () =>
      defer(() => import('../../../widgets/sales/sales-alert-widget.component')).pipe(
        map((m) => m.SalesAlertWidgetComponent)
      )
  }
];
