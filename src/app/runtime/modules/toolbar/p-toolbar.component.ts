import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { Subscription, finalize, forkJoin, take } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { createRuntimeContext } from '../../core/runtime-context';
import { ComponentRenderResponse } from '../../core/render-contract';
import { RenderService } from '../../render/render.service';
import { COMPONENT_ID } from '../../type/component-id';
import {
  RuntimeActionHandled,
  RuntimeTableMeta,
  RuntimeToolbarConfig,
  isIconToolbarButtonConfig,
  isTextToolbarButtonConfig
} from '../../type/runtime-table-config';

@Component({
  standalone: true,
  selector: 'app-p-toolbar',
  imports: [NgComponentOutlet, NzAlertModule, NzEmptyModule, NzTagModule],
  template: `
    <section class="toolbar-shell">
      <div class="toolbar-header">
        <div>
          <strong>{{ config().title }}</strong>
          <p>{{ table().title }} 共 {{ table().rowCount }} 行</p>
        </div>

        <nz-tag nzColor="processing">{{ config().buttons.length }} 个按钮</nz-tag>
      </div>

      <div class="toolbar-kind-row">
        <nz-tag nzColor="blue">文字按钮 {{ textButtonCount() }}</nz-tag>
        <nz-tag nzColor="purple">图标按钮 {{ iconButtonCount() }}</nz-tag>
      </div>

      @if (error(); as errorText) {
        <nz-alert nzType="error" [nzDescription]="errorText" nzShowIcon></nz-alert>
      }

      @if (loading()) {
        <nz-tag nzColor="blue">toolbar 正在解析 p-button...</nz-tag>
      }

      @if (resolvedButtons().length === 0 && !loading()) {
        <nz-empty nzNotFoundContent="toolbar 中暂无按钮配置"></nz-empty>
      } @else {
        <div class="button-row">
          @for (entry of resolvedButtons(); track entry.input.config.id) {
            <ng-container *ngComponentOutlet="entry.component; inputs: entry.input"></ng-container>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './p-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PToolbarComponent implements OnChanges, OnDestroy {
  readonly config = input.required<RuntimeToolbarConfig>();
  readonly table = input.required<RuntimeTableMeta>();
  readonly onActionHandled = input.required<RuntimeActionHandled>();

  protected readonly loading = signal(false);
  protected readonly error = signal<string | undefined>(undefined);
  protected readonly resolvedButtons = signal<
    readonly ComponentRenderResponse<typeof COMPONENT_ID.runtimeButton>[]
  >([]);
  protected readonly textButtonCount = computed(
    () => this.config().buttons.filter((button) => isTextToolbarButtonConfig(button)).length
  );
  protected readonly iconButtonCount = computed(
    () => this.config().buttons.filter((button) => isIconToolbarButtonConfig(button)).length
  );

  private readonly renderService = inject(RenderService);
  private buttonLoadSub?: Subscription;

  ngOnChanges(): void {
    this.loadButtons();
  }

  ngOnDestroy(): void {
    this.buttonLoadSub?.unsubscribe();
  }

  private loadButtons(): void {
    this.buttonLoadSub?.unsubscribe();

    const buttons = this.config().buttons;

    if (buttons.length === 0) {
      this.resolvedButtons.set([]);
      this.error.set(undefined);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.buttonLoadSub = forkJoin(
      buttons.map((button) =>
        this.renderService.render$({
          componentId: COMPONENT_ID.runtimeButton,
          input: {
            config: button,
            table: this.table(),
            onActionHandled: this.onActionHandled()
          },
          context: createRuntimeContext(`p-toolbar:${button.id}`)
        })
      )
    )
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (responses) => {
          this.resolvedButtons.set(responses);
          this.error.set(undefined);
        },
        error: (error: unknown) => {
          this.resolvedButtons.set([]);
          this.error.set(this.toErrorMessage(error));
        }
      });
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
