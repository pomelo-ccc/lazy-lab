import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';


@Component({
  standalone: true,
  selector: 'app-ops-badge-widget',
  imports: [NzBadgeModule, NzCardModule],
  template: `
    <nz-card nzSize="small" nzTitle="运营告警">
      <p><nz-badge nzStatus="processing" nzText="部署进行中"></nz-badge></p>
      <p><nz-badge nzStatus="warning" nzText="2 条待审批"></nz-badge></p>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpsBadgeWidgetComponent {}
