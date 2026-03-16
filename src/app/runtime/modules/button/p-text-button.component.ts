import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { finalize, take } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';

import {
  RuntimeActionHandled,
  RuntimeTableMeta,
  RuntimeTextToolbarButtonConfig
} from '../../type/runtime-table-config';

import { PButtonActionService } from './p-button-action.service';

@Component({
  standalone: true,
  selector: 'app-p-text-button',
  imports: [NzAlertModule, NzButtonModule],
  template: `
    <div class="button-shell">
      <button
        nz-button
        [nzType]="config().buttonType ?? 'default'"
        [nzLoading]="loading()"
        (click)="handleClick()"
      >
        {{ config().label }}
      </button>

      @if (error(); as errorText) {
        <nz-alert nzType="error" [nzDescription]="errorText" nzShowIcon></nz-alert>
      }
    </div>
  `,
  styleUrl: './p-text-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PTextButtonComponent {
  readonly config = input.required<RuntimeTextToolbarButtonConfig>();
  readonly table = input.required<RuntimeTableMeta>();
  readonly onActionHandled = input.required<RuntimeActionHandled>();

  protected readonly loading = signal(false);
  protected readonly error = signal<string | undefined>(undefined);

  private readonly actionService = inject(PButtonActionService);

  protected handleClick(): void {
    this.loading.set(true);

    this.actionService
      .execute$({
        config: this.config(),
        table: this.table(),
        onActionHandled: this.onActionHandled()
      })
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (entry) => {
          this.error.set(undefined);
          this.onActionHandled()(entry);
        },
        error: (error: unknown) => {
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
