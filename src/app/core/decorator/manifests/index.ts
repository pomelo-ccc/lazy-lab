import { FINANCE_LAZY_MANIFEST } from './finance.manifest';
import { INVENTORY_LAZY_MANIFEST } from './inventory.manifest';
import { LazyManifestEntry } from './lazy-manifest-entry';
import { OPS_LAZY_MANIFEST } from './ops.manifest';
import { SALES_LAZY_MANIFEST } from './sales.manifest';
import { SUPPORT_LAZY_MANIFEST } from './support.manifest';

export const LAZY_COMPONENT_MANIFEST: ReadonlyArray<LazyManifestEntry> = [
  ...SALES_LAZY_MANIFEST,
  ...INVENTORY_LAZY_MANIFEST,
  ...OPS_LAZY_MANIFEST,
  ...FINANCE_LAZY_MANIFEST,
  ...SUPPORT_LAZY_MANIFEST
];
