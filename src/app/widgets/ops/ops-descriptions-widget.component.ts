import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';


@Component({
  standalone: true,
  selector: 'app-ops-descriptions-widget',
  imports: [NzCardModule, NzDescriptionsModule],
  template: `
    <nz-card nzSize="small" nzTitle="运营摘要">
      <nz-descriptions nzBordered [nzColumn]="1" nzSize="small">
        <nz-descriptions-item nzTitle="班次">夜班</nz-descriptions-item>
        <nz-descriptions-item nzTitle="操作组">蓝队</nz-descriptions-item>
        <nz-descriptions-item nzTitle="时长">03:18:44</nz-descriptions-item>
      </nz-descriptions>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpsDescriptionsWidgetComponent {}
