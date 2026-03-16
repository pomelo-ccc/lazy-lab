import { ALL_COMPONENT_IDS, ComponentId, COMPONENT_ID } from './component-ids';

export const COMPONENT_LABELS: Readonly<Record<ComponentId, string>> = {
  [COMPONENT_ID.salesKpi]: '销售 KPI',
  [COMPONENT_ID.salesTrend]: '销售趋势',
  [COMPONENT_ID.salesAlert]: '销售提醒',
  [COMPONENT_ID.inventoryTable]: '库存表格',
  [COMPONENT_ID.inventoryTags]: '库存标签',
  [COMPONENT_ID.inventoryTimeline]: '库存时间线',
  [COMPONENT_ID.opsResult]: '运营结果',
  [COMPONENT_ID.opsDescriptions]: '运营摘要',
  [COMPONENT_ID.opsBadge]: '运营告警',
  [COMPONENT_ID.financeList]: '财务列表',
  [COMPONENT_ID.financeAvatar]: '审批人',
  [COMPONENT_ID.financeCollapse]: '预算检查',
  [COMPONENT_ID.supportEmpty]: '工单队列',
  [COMPONENT_ID.supportProgress]: 'SLA 进度',
  [COMPONENT_ID.supportTimeline]: '事件时间线',
  [COMPONENT_ID.eagerHealth]: '预加载组件'
};

const ALL_COMPONENT_ID_SET: ReadonlySet<string> = new Set<string>(ALL_COMPONENT_IDS);

export function getComponentLabel(name: string): string {
  if (ALL_COMPONENT_ID_SET.has(name)) {
    return COMPONENT_LABELS[name as ComponentId];
  }

  return name;
}
