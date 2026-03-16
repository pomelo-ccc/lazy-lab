import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzResultModule } from 'ng-zorro-antd/result';


@Component({
  standalone: true,
  selector: 'app-ops-result-widget',
  imports: [NzCardModule, NzResultModule],
  template: `
    <nz-card nzSize="small" nzTitle="运营结果">
      <nz-result nzStatus="success" nzTitle="批处理完成" nzSubTitle="全部检查通过。"></nz-result>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpsResultWidgetComponent {}
