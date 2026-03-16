import { defer, map } from 'rxjs';

import { COMPONENT_ID } from '../../../shared/component-ids';
import { LazyManifestEntry } from './lazy-manifest-entry';

export const INVENTORY_LAZY_MANIFEST: ReadonlyArray<LazyManifestEntry> = [
  {
    id: COMPONENT_ID.inventoryTable,
    loader: () =>
      defer(() => import('../../../widgets/inventory/inventory-table-widget.component')).pipe(
        map((m) => m.InventoryTableWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.inventoryTags,
    loader: () =>
      defer(() => import('../../../widgets/inventory/inventory-tags-widget.component')).pipe(
        map((m) => m.InventoryTagsWidgetComponent)
      )
  },
  {
    id: COMPONENT_ID.inventoryTimeline,
    loader: () =>
      defer(() => import('../../../widgets/inventory/inventory-timeline-widget.component')).pipe(
        map((m) => m.InventoryTimelineWidgetComponent)
      )
  }
];
