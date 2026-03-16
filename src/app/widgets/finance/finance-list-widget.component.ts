import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';


@Component({
  standalone: true,
  selector: 'app-finance-list-widget',
  imports: [NzCardModule, NzListModule],
  template: `
    <nz-card nzSize="small" nzTitle="财务列表">
      <nz-list nzSize="small" [nzDataSource]="items()" [nzRenderItem]="itemTpl"></nz-list>
      <ng-template #itemTpl let-item>
        <nz-list-item>{{ item }}</nz-list-item>
      </ng-template>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceListWidgetComponent {
  protected readonly items = signal<string[]>([
    '现金流报表已审批',
    '费用批次 #194 待处理',
    '发票同步已完成'
  ]);
}
