import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';


@Component({
  standalone: true,
  selector: 'app-support-progress-widget',
  imports: [NzCardModule, NzProgressModule],
  template: `
    <nz-card nzSize="small" nzTitle="SLA 达成率">
      <nz-progress [nzPercent]="resolvedRate()" nzStrokeColor="#52c41a"></nz-progress>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportProgressWidgetComponent {
  protected readonly resolvedRate = signal(81);
}
