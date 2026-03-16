import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';


@Component({
  standalone: true,
  selector: 'app-inventory-tags-widget',
  imports: [NzCardModule, NzTagModule],
  template: `
    <nz-card nzSize="small" nzTitle="库存标签">
      @for (tag of tags(); track tag) {
        <nz-tag nzColor="processing">{{ tag }}</nz-tag>
      }
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTagsWidgetComponent {
  protected readonly tags = signal<readonly string[]>(['紧急', '大批量', '预留']);
}
