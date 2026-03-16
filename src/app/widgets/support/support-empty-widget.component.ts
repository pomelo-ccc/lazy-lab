import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';


@Component({
  standalone: true,
  selector: 'app-support-empty-widget',
  imports: [NzCardModule, NzEmptyModule],
  template: `
    <nz-card nzSize="small" nzTitle="工单队列">
      <nz-empty nzNotFoundContent="暂无待处理工单"></nz-empty>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportEmptyWidgetComponent {}
