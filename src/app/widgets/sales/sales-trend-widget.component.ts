import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';


@Component({
  standalone: true,
  selector: 'app-sales-trend-widget',
  imports: [NzCardModule, NzProgressModule],
  template: `
    <nz-card nzSize="small" nzTitle="季度进度">
      <nz-progress [nzPercent]="progress()" nzStatus="active"></nz-progress>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesTrendWidgetComponent {
  protected readonly progress = signal(74);
}
