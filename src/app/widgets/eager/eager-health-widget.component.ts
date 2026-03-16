import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  standalone: true,
  selector: 'app-eager-health-widget',
  imports: [NzCardModule, NzTagModule],
  template: `
    <nz-card nzSize="small" nzTitle="预加载组件">
      <p>该组件在启动阶段显式注册，可被同步调用直接获取。</p>
      <nz-tag nzColor="green">已预加载</nz-tag>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EagerHealthWidgetComponent {}
