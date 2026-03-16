import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { LazyComponentId } from '../component-ids';
import { getComponentLabel } from '../component-labels';
import { DynamicPlaygroundComponent } from '../dynamic-playground/dynamic-playground.component';

@Component({
  selector: 'app-lazy-page-shell',
  imports: [NzCardModule, NzTagModule, NzTypographyModule, DynamicPlaygroundComponent],
  template: `
    <section class="page-shell">
      <nz-card nzSize="small">
        <h2 nz-typography>{{ title() }}</h2>
        <p nz-typography>{{ description() }}</p>

        <div class="tag-row">
          @for (name of componentKeys(); track name) {
            <nz-tag nzColor="blue">{{ getComponentLabel(name) }}</nz-tag>
          }
        </div>
      </nz-card>

      <app-dynamic-playground [componentKeys]="componentKeys()"></app-dynamic-playground>
    </section>
  `,
  styleUrl: './lazy-page-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyPageShellComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly componentKeys = input.required<readonly LazyComponentId[]>();
  protected readonly getComponentLabel = getComponentLabel;
}
