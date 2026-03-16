export const COMPONENT_ID = {
  salesKpi: 'sales-kpi',
  salesTrend: 'sales-trend',
  salesAlert: 'sales-alert',
  inventoryTable: 'inventory-table',
  inventoryTags: 'inventory-tags',
  inventoryTimeline: 'inventory-timeline',
  opsResult: 'ops-result',
  opsDescriptions: 'ops-descriptions',
  opsBadge: 'ops-badge',
  financeList: 'finance-list',
  financeAvatar: 'finance-avatar',
  financeCollapse: 'finance-collapse',
  supportEmpty: 'support-empty',
  supportProgress: 'support-progress',
  supportTimeline: 'support-timeline',
  eagerHealth: 'eager-health'
} as const;

export type ComponentId = (typeof COMPONENT_ID)[keyof typeof COMPONENT_ID];

export const SALES_COMPONENT_IDS = [
  COMPONENT_ID.salesKpi,
  COMPONENT_ID.salesTrend,
  COMPONENT_ID.salesAlert
] as const;

export const INVENTORY_COMPONENT_IDS = [
  COMPONENT_ID.inventoryTable,
  COMPONENT_ID.inventoryTags,
  COMPONENT_ID.inventoryTimeline
] as const;

export const OPS_COMPONENT_IDS = [
  COMPONENT_ID.opsResult,
  COMPONENT_ID.opsDescriptions,
  COMPONENT_ID.opsBadge
] as const;

export const FINANCE_COMPONENT_IDS = [
  COMPONENT_ID.financeList,
  COMPONENT_ID.financeAvatar,
  COMPONENT_ID.financeCollapse
] as const;

export const SUPPORT_COMPONENT_IDS = [
  COMPONENT_ID.supportEmpty,
  COMPONENT_ID.supportProgress,
  COMPONENT_ID.supportTimeline
] as const;

export const EAGER_COMPONENT_IDS = [COMPONENT_ID.eagerHealth] as const;

export const PAGE_COMPONENT_IDS = {
  pageOne: SALES_COMPONENT_IDS,
  pageTwo: INVENTORY_COMPONENT_IDS,
  pageThree: OPS_COMPONENT_IDS,
  pageFour: FINANCE_COMPONENT_IDS,
  pageFive: SUPPORT_COMPONENT_IDS
} as const;

export const LAZY_COMPONENT_IDS = [
  ...SALES_COMPONENT_IDS,
  ...INVENTORY_COMPONENT_IDS,
  ...OPS_COMPONENT_IDS,
  ...FINANCE_COMPONENT_IDS,
  ...SUPPORT_COMPONENT_IDS
] as const;

export type LazyComponentId = (typeof LAZY_COMPONENT_IDS)[number];
export type EagerComponentId = (typeof EAGER_COMPONENT_IDS)[number];

export const ALL_COMPONENT_IDS = [...LAZY_COMPONENT_IDS, ...EAGER_COMPONENT_IDS] as const;
