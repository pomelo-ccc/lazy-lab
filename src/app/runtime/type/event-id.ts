// ─── 表格操作 ────────────────────────────────────────────────────────────────
export const TABLE_EVENT_ID = {
  reloadTable:  'reloadTable',
  exportRows:   'exportRows',
  archiveRows:  'archiveRows',
  printRows:    'printRows',
  batchDelete:  'batchDelete',
} as const;

// ─── 订单 ────────────────────────────────────────────────────────────────────
export const ORDER_EVENT_ID = {
  createOrder:  'createOrder',
  cancelOrder:  'cancelOrder',
  confirmOrder: 'confirmOrder',
  shipOrder:    'shipOrder',
} as const;

// ─── 客户 ────────────────────────────────────────────────────────────────────
export const CUSTOMER_EVENT_ID = {
  viewCustomer:       'viewCustomer',
  updateCustomerTag:  'updateCustomerTag',
} as const;

// ─── 产品 ────────────────────────────────────────────────────────────────────
export const PRODUCT_EVENT_ID = {
  publishProduct:   'publishProduct',
  unpublishProduct: 'unpublishProduct',
  adjustPrice:      'adjustPrice',
} as const;

// ─── 通知（同步，无副作用，不需要懒加载）────────────────────────────────────
export const NOTIFICATION_EVENT_ID = {
  sendNotification: 'sendNotification',
  markAsRead:       'markAsRead',
} as const;

// ─── 用户档案 ────────────────────────────────────────────────────────────────
export const USER_PROFILE_EVENT_ID = {
  userProfileViewed: 'user-profile-viewed',
} as const;

// ─── 审计（同步）────────────────────────────────────────────────────────────
export const AUDIT_EVENT_ID = {
  logAuditEvent: 'logAuditEvent',
} as const;

// ─── 聚合 ────────────────────────────────────────────────────────────────────
export const EVENT_ID = {
  ...TABLE_EVENT_ID,
  ...ORDER_EVENT_ID,
  ...CUSTOMER_EVENT_ID,
  ...PRODUCT_EVENT_ID,
  ...NOTIFICATION_EVENT_ID,
  ...USER_PROFILE_EVENT_ID,
  ...AUDIT_EVENT_ID,
} as const;

export type EventId = (typeof EVENT_ID)[keyof typeof EVENT_ID];

// 工具栏按钮可触发的事件子集（保持与 runtime-table-config 兼容）
export const TABLE_TOOLBAR_EVENT_IDS = [
  EVENT_ID.reloadTable,
  EVENT_ID.exportRows,
  EVENT_ID.archiveRows,
  EVENT_ID.printRows,
  EVENT_ID.batchDelete,
] as const;

export type ToolbarEventId = (typeof TABLE_TOOLBAR_EVENT_IDS)[number];

export const ALL_EVENT_IDS = [
  ...TABLE_TOOLBAR_EVENT_IDS,
  EVENT_ID.createOrder,
  EVENT_ID.cancelOrder,
  EVENT_ID.confirmOrder,
  EVENT_ID.shipOrder,
  EVENT_ID.viewCustomer,
  EVENT_ID.updateCustomerTag,
  EVENT_ID.publishProduct,
  EVENT_ID.unpublishProduct,
  EVENT_ID.adjustPrice,
  EVENT_ID.sendNotification,
  EVENT_ID.markAsRead,
  EVENT_ID.userProfileViewed,
  EVENT_ID.logAuditEvent,
] as const;
