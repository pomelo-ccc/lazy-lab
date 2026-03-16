import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';


@Component({
  standalone: true,
  selector: 'app-inventory-timeline-widget',
  imports: [NzCardModule, NzTimelineModule],
  template: `
    <nz-card nzSize="small" nzTitle="库存时间线">
      <nz-timeline>
        <nz-timeline-item color="green">接收入库 AX-101</nz-timeline-item>
        <nz-timeline-item color="blue">AX-155 调拨到 B4</nz-timeline-item>
        <nz-timeline-item color="red">BZ-200 触发低库存告警</nz-timeline-item>
      </nz-timeline>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTimelineWidgetComponent {}
