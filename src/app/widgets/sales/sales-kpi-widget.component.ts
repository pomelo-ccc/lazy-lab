import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';


@Component({
  standalone: true,
  selector: 'app-sales-kpi-widget',
  imports: [NzCardModule, NzStatisticModule],
  template: `
    <nz-card nzSize="small" nzTitle="销售 KPI">
      <nz-statistic [nzValue]="amount()" nzPrefix="$" [nzValueStyle]="valueStyle"></nz-statistic>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesKpiWidgetComponent {
  protected readonly amount = signal(1284000);
  protected readonly valueStyle = { color: '#3f8600' };
}
