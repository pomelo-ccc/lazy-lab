import { Injectable } from '@angular/core';

import { RuntimeEvent } from '../../core/event-contract';
import { EventPayloadMapFromMethods, EventResultMapFromMethods } from '../../type/event-type-helpers';
import { RuntimeTableEventPayload, RuntimeTableEventResult } from '../../type/runtime-table-config';

type TableEvent = RuntimeEvent<RuntimeTableEventPayload>;

@Injectable({ providedIn: 'root' })
export class TableEventsActions {
  reloadTable(event: TableEvent): RuntimeTableEventResult {
    return this.buildResult('reloadTable', event, '已重新拉取表格数据');
  }

  exportRows(event: TableEvent): RuntimeTableEventResult {
    return this.buildResult('exportRows', event, `已导出 ${event.rowCount} 行数据`);
  }

  archiveRows(event: TableEvent): RuntimeTableEventResult {
    return this.buildResult('archiveRows', event, '已触发批量归档动作');
  }

  printRows(event: TableEvent): RuntimeTableEventResult {
    return this.buildResult('printRows', event, `已发送 ${event.rowCount} 行到打印队列`);
  }

  batchDelete(event: TableEvent): RuntimeTableEventResult {
    return this.buildResult('batchDelete', event, `已删除 ${event.rowCount} 行数据`);
  }

  private buildResult(
    methodName: string,
    event: TableEvent,
    actionText: string
  ): RuntimeTableEventResult {
    return {
      auditId: `audit-${event.context.requestId}`,
      handledAt: event.context.timestamp,
      methodName,
      message:
        `${event.buttonLabel} -> ${actionText}。` +
        `table=${event.tableTitle}，rows=${event.rowCount}`
    };
  }
}

// ─── 局部 map 片段，由 EventPayloadMap / EventResultMap 的 merge 入口引用 ────

export type TableEventPayloadMap = EventPayloadMapFromMethods<TableEventsActions>;

export type TableEventResultMap = EventResultMapFromMethods<TableEventsActions>;
