import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';


@Component({
  standalone: true,
  selector: 'app-sales-alert-widget',
  imports: [NzAlertModule, NzCardModule],
  template: `
    <nz-card nzSize="small" nzTitle="销售提醒">
      <nz-alert nzType="info" nzMessage="北区已达到 92% 目标。" nzShowIcon></nz-alert>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesAlertWidgetComponent {}
