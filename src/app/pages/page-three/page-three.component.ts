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
export class PageThreeComponent {
  protected readonly title = '页面 3 - 运营';
  protected readonly description = '运营组件用于验证并发解析和缓存复用行为。';
  protected readonly componentKeys = PAGE_COMPONENT_IDS.pageThree;
}
