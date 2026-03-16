import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PAGE_COMPONENT_IDS } from '../../shared/component-ids';
import { LazyPageShellComponent } from '../../shared/lazy-page-shell/lazy-page-shell.component';

@Component({
  standalone: true,
  imports: [LazyPageShellComponent],
  template: `
    <app-lazy-page-shell
      [title]="title"
      [description]="description"
      [componentKeys]="componentKeys"
    ></app-lazy-page-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageFourComponent {
  protected readonly title = '页面 4 - 财务';
  protected readonly description = '财务组件在流式解析完成前都保持懒加载状态。';
  protected readonly componentKeys = PAGE_COMPONENT_IDS.pageFour;
}
