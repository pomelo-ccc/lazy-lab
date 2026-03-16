import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';


@Component({
  standalone: true,
  selector: 'app-finance-collapse-widget',
  imports: [NzCardModule, NzCollapseModule],
  template: `
    <nz-card nzSize="small" nzTitle="预算检查">
      <nz-collapse>
        <nz-collapse-panel nzHeader="预算策略" [nzActive]="true">
          月度上限校验已完成。
        </nz-collapse-panel>
        <nz-collapse-panel nzHeader="税务策略">
          仍有 2 条记录需要补全税码映射。
        </nz-collapse-panel>
      </nz-collapse>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceCollapseWidgetComponent {}
