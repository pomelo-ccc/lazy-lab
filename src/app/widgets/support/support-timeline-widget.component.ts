import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';


@Component({
  standalone: true,
  selector: 'app-support-timeline-widget',
  imports: [NzCardModule, NzTimelineModule],
  template: `
    <nz-card nzSize="small" nzTitle="事件时间线">
      <nz-timeline>
        <nz-timeline-item color="blue">09:12 工单已创建</nz-timeline-item>
        <nz-timeline-item color="red">09:33 已升级到二线支持</nz-timeline-item>
        <nz-timeline-item color="green">10:02 已提供临时解决方案</nz-timeline-item>
      </nz-timeline>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportTimelineWidgetComponent {}
