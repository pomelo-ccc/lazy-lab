import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';


@Component({
  standalone: true,
  selector: 'app-finance-avatar-widget',
  imports: [NzAvatarModule, NzCardModule],
  template: `
    <nz-card nzSize="small" nzTitle="审批人">
      <div class="avatar-row">
        <nz-avatar nzText="AL"></nz-avatar>
        <nz-avatar nzText="BM" nzBackgroundColor="#1890ff"></nz-avatar>
        <nz-avatar nzText="CK" nzBackgroundColor="#52c41a"></nz-avatar>
      </div>
    </nz-card>
  `,
  styles: [
    `
      .avatar-row {
        display: flex;
        gap: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceAvatarWidgetComponent {}
