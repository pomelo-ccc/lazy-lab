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
export class PageFiveComponent {
  protected readonly title = '页面 5 - 支持';
  protected readonly description = '支持组件用于验证失败重试、缓存命中和路由懒加载边界。';
  protected readonly componentKeys = PAGE_COMPONENT_IDS.pageFive;
}
