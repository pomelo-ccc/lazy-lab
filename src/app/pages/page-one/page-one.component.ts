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
export class PageOneComponent {
  protected readonly title = '页面 1 - 销售';
  protected readonly description = '路由级懒加载页面，包含 3 个懒组件和同步兼容校验。';
  protected readonly componentKeys = PAGE_COMPONENT_IDS.pageOne;
}
