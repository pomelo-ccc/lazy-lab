import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';

interface UserProfileViewModel {
  readonly id: string;
  readonly name: string;
  readonly department: string;
  readonly city: string;
  readonly level: 'gold' | 'blue' | 'green';
}

const USER_PROFILE_FIXTURES: Record<string, UserProfileViewModel> = {
  u001: {
    id: 'u001',
    name: '林安',
    department: '客户成功',
    city: '杭州',
    level: 'gold'
  },
  u209: {
    id: 'u209',
    name: '周予',
    department: '运营分析',
    city: '上海',
    level: 'blue'
  },
  u777: {
    id: 'u777',
    name: '苏明',
    department: '售后支持',
    city: '深圳',
    level: 'green'
  }
};

@Component({
  standalone: true,
  selector: 'app-user-profile-card',
  imports: [NzCardModule, NzDescriptionsModule, NzTagModule],
  template: `
    <nz-card nzSize="small" [nzTitle]="profile().name" [nzExtra]="levelTag">
      <ng-template #levelTag>
        <nz-tag [nzColor]="levelColor()">{{ profile().level }}</nz-tag>
      </ng-template>

      <nz-descriptions nzBordered [nzColumn]="1" nzSize="small">
        <nz-descriptions-item nzTitle="用户 ID">{{ profile().id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="部门">{{ profile().department }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="城市">{{ profile().city }}</nz-descriptions-item>
      </nz-descriptions>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileCardComponent {
  readonly userId = input.required<string>();

  protected readonly profile = computed(() => USER_PROFILE_FIXTURES[this.userId()] ?? buildFallback(this.userId()));
  protected readonly levelColor = computed(() => {
    switch (this.profile().level) {
      case 'gold':
        return 'gold';
      case 'blue':
        return 'blue';
      default:
        return 'green';
    }
  });
}

function buildFallback(userId: string): UserProfileViewModel {
  return {
    id: userId,
    name: '未建档用户',
    department: 'Runtime Lab',
    city: 'Unknown',
    level: 'green'
  };
}
