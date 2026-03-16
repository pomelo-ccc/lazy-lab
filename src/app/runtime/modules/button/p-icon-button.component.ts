import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { finalize, take } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import {
  RuntimeActionHandled,
  RuntimeIconToolbarButtonConfig,
  RuntimeTableMeta
} from '../../type/runtime-table-config';

import { PButtonActionService } from './p-button-action.service';

@Component({
  standalone: true,
  selector: 'app-p-icon-button',
  imports: [NzAlertModule, NzButtonModule, NzIconModule],
  template: `
    <div class="button-shell">
      <button
        nz-button
        nzShape="circle"
        [nzType]="config().buttonType ?? 'default'"
        [nzLoading]="loading()"
        [title]="config().label"
        [attr.aria-label]="config().label"
        (click)="handleClick()"
      >
        <nz-icon [nzType]="config().icon"></nz-icon>
      </button>

      @if (error(); as errorText) {
        <nz-alert nzType="error" [nzDescription]="errorText" nzShowIcon></nz-alert>
      }
    </div>
  `,
  styleUrl: './p-icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PIconButtonComponent {
  readonly config = input.required<RuntimeIconToolbarButtonConfig>();
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
