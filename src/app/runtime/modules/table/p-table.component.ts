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
import { Subscription, finalize, take } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { createRuntimeContext } from '../../core/runtime-context';
import { ComponentRenderResponse } from '../../core/render-contract';
import { RenderService } from '../../render/render.service';
import { COMPONENT_ID } from '../../type/component-id';
import {
  RuntimeTableConfig,
  RuntimeTableMeta,
  RuntimeToolbarActionRecord
} from '../../type/runtime-table-config';

interface ActionLogEntry extends RuntimeToolbarActionRecord {
  readonly id: number;
}

@Component({
  standalone: true,
  selector: 'app-p-table',
  imports: [NgComponentOutlet, NzAlertModule, NzButtonModule, NzCardModule, NzEmptyModule, NzTagModule],
  template: `
    <nz-card [nzTitle]="config().title" nzSize="small">
      <p class="table-summary">{{ config().summary }}</p>

      <div class="meta-row">
        <nz-tag nzColor="geekblue">{{ config().id }}</nz-tag>
        <nz-tag nzColor="cyan">{{ config().rows.length }} rows</nz-tag>
        @if (config().toolbar) {
          <nz-tag nzColor="processing">需要 toolbar 模块</nz-tag>
        } @else {
          <nz-tag nzColor="default">不加载 toolbar 模块</nz-tag>
        }
      </div>

      @if (config().toolbar) {
        <div class="toolbar-toggle-row">
          <button nz-button [nzType]="toolbarVisible() ? 'default' : 'primary'" (click)="toggleToolbar()">
            {{ toolbarVisible() ? '隐藏 toolbar' : '显示 toolbar' }}
          </button>

          @if (resolvedToolbar()) {
            <nz-tag nzColor="success">toolbar 已解析</nz-tag>
          } @else {
            <nz-tag nzColor="default">toolbar 尚未加载</nz-tag>
          }
        </div>

        <section class="toolbar-slot">
          @if (!toolbarVisible()) {
            <div class="toolbar-placeholder">
              点击上方按钮后，table 才会动态加载 toolbar；toolbar 再统一加载 p-button 模块，
              p-button 内部再根据类型加载文字按钮或图标按钮文件。
            </div>
          } @else {
            @if (toolbarError(); as errorText) {
              <nz-alert nzType="error" [nzDescription]="errorText" nzShowIcon></nz-alert>
            }

            @if (toolbarLoading()) {
              <nz-tag nzColor="processing">toolbar 模块解析中...</nz-tag>
            }

            @if (resolvedToolbar(); as toolbarEntry) {
              <ng-container *ngComponentOutlet="toolbarEntry.component; inputs: toolbarEntry.input"></ng-container>
            }
          }
        </section>
      } @else {
        <div class="toolbar-disabled">
          当前 table 配置里没有 toolbar，因此不会触发 toolbar/button 的懒加载。
        </div>
      }

      @if (config().rows.length === 0) {
        <nz-empty nzNotFoundContent="暂无表格数据"></nz-empty>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
              <tr>
                @for (column of config().columns; track column.key) {
                  <th>{{ column.label }}</th>
                }
              </tr>
            </thead>

            <tbody>
              @for (row of config().rows; track row.id) {
                <tr>
                  @for (column of config().columns; track column.key) {
                    <td>{{ row.cells[column.key] }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <section class="action-section">
        <h4>事件执行日志</h4>

        @if (actionLogs().length === 0) {
          <nz-empty nzNotFoundContent="点击 toolbar 按钮后，这里会显示事件执行结果"></nz-empty>
        } @else {
          <ul class="action-list">
            @for (entry of actionLogs(); track entry.id) {
              <li>
                <strong>{{ entry.buttonLabel }}</strong>
                <span>{{ entry.message }}</span>
                <code>{{ entry.methodName }}</code>
              </li>
            }
          </ul>
        }
      </section>
    </nz-card>
  `,
  styleUrl: './p-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PTableComponent implements OnChanges, OnDestroy {
  readonly config = input.required<RuntimeTableConfig>();

  protected readonly toolbarVisible = signal(false);
  protected readonly toolbarLoading = signal(false);
  protected readonly toolbarError = signal<string | undefined>(undefined);
  protected readonly resolvedToolbar = signal<
    ComponentRenderResponse<typeof COMPONENT_ID.runtimeToolbar> | null
  >(null);
  protected readonly actionLogs = signal<readonly ActionLogEntry[]>([]);
  protected readonly tableMeta = computed<RuntimeTableMeta>(() => ({
    id: this.config().id,
    title: this.config().title,
    rowCount: this.config().rows.length
  }));

  private readonly renderService = inject(RenderService);
  private toolbarLoadSub?: Subscription;
  private logId = 0;
  private readonly handleAction = (entry: RuntimeToolbarActionRecord): void => {
    this.actionLogs.update((logs) => [{ ...entry, id: ++this.logId }, ...logs].slice(0, 8));
  };

  ngOnChanges(): void {
    this.toolbarLoadSub?.unsubscribe();
    this.toolbarVisible.set(false);
    this.toolbarLoading.set(false);
    this.toolbarError.set(undefined);
    this.resolvedToolbar.set(null);
    this.actionLogs.set([]);
  }

  ngOnDestroy(): void {
    this.toolbarLoadSub?.unsubscribe();
  }

  protected toggleToolbar(): void {
    if (!this.config().toolbar) {
      return;
    }

    const nextVisible = !this.toolbarVisible();
    this.toolbarVisible.set(nextVisible);

    if (nextVisible && (!this.resolvedToolbar() || this.toolbarError())) {
      this.loadToolbar();
    }
  }

  private loadToolbar(): void {
    this.toolbarLoadSub?.unsubscribe();

    const toolbar = this.config().toolbar;

    if (!toolbar) {
      this.toolbarLoading.set(false);
      this.toolbarError.set(undefined);
      this.resolvedToolbar.set(null);
      return;
    }

    this.toolbarLoading.set(true);

    this.toolbarLoadSub = this.renderService
      .render$({
        componentId: COMPONENT_ID.runtimeToolbar,
        input: {
          config: toolbar,
          table: this.tableMeta(),
          onActionHandled: this.handleAction
        },
        context: createRuntimeContext(`p-table:${this.config().id}`)
      })
      .pipe(
        take(1),
        finalize(() => this.toolbarLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.resolvedToolbar.set(response);
          this.toolbarError.set(undefined);
        },
        error: (error: unknown) => {
          this.resolvedToolbar.set(null);
          this.toolbarError.set(this.toErrorMessage(error));
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
