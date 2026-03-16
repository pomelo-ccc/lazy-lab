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
export class PageTwoComponent {
  protected readonly title = '页面 2 - 库存';
  protected readonly description = '库存组件仅在对应组件被解析时才会加载。';
  protected readonly componentKeys = PAGE_COMPONENT_IDS.pageTwo;
}
