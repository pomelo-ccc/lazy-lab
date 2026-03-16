import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  Type,
  input,
  signal
} from '@angular/core';
import { Observable, Subscription, defer, finalize, map, take } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTagModule } from 'ng-zorro-antd/tag';

import {
  RuntimeActionHandled,
  RuntimeButtonInput,
  RuntimeIconToolbarButtonConfig,
  RuntimeTableMeta,
  RuntimeTextToolbarButtonConfig,
  isIconToolbarButtonConfig,
  isTextToolbarButtonConfig
} from '../../type/runtime-table-config';

import { resolvePButtonVariant } from './p-button-variant';

interface PButtonViewOutlet {
  readonly component: Type<unknown>;
  readonly inputs: Record<string, unknown>;
}

@Component({
  standalone: true,
  selector: 'app-p-button',
  imports: [NgComponentOutlet, NzAlertModule, NzTagModule],
  template: `
    <section class="button-host">
      @if (loading()) {
        <nz-tag nzColor="blue">p-button 正在解析 {{ variantLabel() }} 文件...</nz-tag>
      }

      @if (error(); as errorText) {
        <nz-alert nzType="error" [nzDescription]="errorText" nzShowIcon></nz-alert>
      }

      @if (viewOutlet(); as outlet) {
        <ng-container *ngComponentOutlet="outlet.component; inputs: outlet.inputs"></ng-container>
      }
    </section>
  `,
  styleUrl: './p-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PButtonComponent implements OnChanges, OnDestroy {
  readonly config = input.required<RuntimeButtonInput['config']>();
  readonly table = input.required<RuntimeTableMeta>();
  readonly onActionHandled = input.required<RuntimeActionHandled>();

  protected readonly loading = signal(false);
  protected readonly error = signal<string | undefined>(undefined);
  protected readonly viewOutlet = signal<PButtonViewOutlet | null>(null);
  protected readonly variantLabel = signal<'text' | 'icon'>('text');

  private viewLoadSub?: Subscription;

  ngOnChanges(): void {
    this.loadView();
  }

  ngOnDestroy(): void {
    this.viewLoadSub?.unsubscribe();
  }

  private loadView(): void {
    this.viewLoadSub?.unsubscribe();

    const config = this.config();
    const table = this.table();
    const onActionHandled = this.onActionHandled();
    const variant = resolvePButtonVariant(config);
    let view$: Observable<PButtonViewOutlet>;

    this.variantLabel.set(variant);
    this.loading.set(true);

    if (isIconToolbarButtonConfig(config)) {
      view$ = defer(() => import('./p-icon-button.component')).pipe(
        map((module) => ({
          component: module.PIconButtonComponent,
          inputs: this.buildIconInputs(config, table, onActionHandled)
        }))
      );
    } else if (isTextToolbarButtonConfig(config)) {
      view$ = defer(() => import('./p-text-button.component')).pipe(
        map((module) => ({
          component: module.PTextButtonComponent,
          inputs: this.buildTextInputs(config, table, onActionHandled)
        }))
      );
    } else {
      this.loading.set(false);
      this.viewOutlet.set(null);
      this.error.set('[PButtonConfigError] 未知按钮类型。');
      return;
    }

    this.viewLoadSub = view$
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (outlet: PButtonViewOutlet) => {
          this.viewOutlet.set(outlet);
          this.error.set(undefined);
        },
        error: (error: unknown) => {
          this.viewOutlet.set(null);
          this.error.set(this.toErrorMessage(error));
        }
      });
  }

  private buildTextInputs(
    config: RuntimeTextToolbarButtonConfig,
    table: RuntimeTableMeta,
    onActionHandled: RuntimeActionHandled
  ): Record<string, unknown> {
    return {
      config,
      table,
      onActionHandled
    };
  }

  private buildIconInputs(
    config: RuntimeIconToolbarButtonConfig,
    table: RuntimeTableMeta,
    onActionHandled: RuntimeActionHandled
  ): Record<string, unknown> {
    return {
      config,
      table,
      onActionHandled
    };
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
