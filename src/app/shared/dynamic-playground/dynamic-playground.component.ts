import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type, inject, input, signal } from '@angular/core';
import { finalize, take } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { ActionHandleService } from '../../core/services/action-handle.service';
import { COMPONENT_ID, ComponentId, LazyComponentId } from '../component-ids';
import { getComponentLabel } from '../component-labels';

type ComponentMap = Partial<Record<ComponentId, Type<unknown> | undefined>>;
type ErrorMap = Partial<Record<ComponentId, string | undefined>>;
type LoadingMap = Partial<Record<ComponentId, boolean | undefined>>;

@Component({
  selector: 'app-dynamic-playground',
  imports: [
    NgComponentOutlet,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzEmptyModule,
    NzTagModule
  ],
  template: `
    <section class="playground-grid">
      @for (name of componentKeys(); track name) {
        <nz-card [nzTitle]="getComponentLabel(name)" [nzExtra]="modeTag">
          <ng-template #modeTag>
            <nz-tag nzColor="geekblue">懒加载组件</nz-tag>
          </ng-template>

          <div class="actions-row">
            <button nz-button nzType="primary" [nzLoading]="loadingMap()[name]" (click)="loadStream(name)">
              流式解析
            </button>
            <button nz-button (click)="loadSync(name)">同步解析</button>
            <button nz-button nzType="default" (click)="clear(name)">清空</button>
          </div>

          @if (errorMap()[name]; as errorText) {
            <nz-alert nzType="error" [nzDescription]="errorText" nzShowIcon></nz-alert>
          }

          @if (componentMap()[name]; as dynamicComponent) {
            <div class="dynamic-outlet">
              <ng-container *ngComponentOutlet="dynamicComponent"></ng-container>
            </div>
          } @else {
            <nz-empty nzNotFoundContent="未加载"></nz-empty>
          }
        </nz-card>
      }
    </section>

    <nz-divider></nz-divider>

    <nz-card nzTitle="同步兼容校验（预加载组件）" nzSize="small">
      <div class="actions-row">
        <button nz-button nzType="primary" (click)="loadSync(eagerKey)">同步加载预加载组件</button>
        <button nz-button nzType="default" (click)="loadStream(eagerKey)">流式加载预加载组件</button>
        <button nz-button (click)="clear(eagerKey)">清空</button>
      </div>

      @if (errorMap()[eagerKey]; as eagerError) {
        <nz-alert nzType="warning" [nzDescription]="eagerError" nzShowIcon></nz-alert>
      }

      @if (componentMap()[eagerKey]; as eagerComponent) {
        <div class="dynamic-outlet">
          <ng-container *ngComponentOutlet="eagerComponent"></ng-container>
        </div>
      } @else {
        <nz-empty nzNotFoundContent="点击“同步加载预加载组件”验证旧路径"></nz-empty>
      }
    </nz-card>

    <nz-divider></nz-divider>

    <nz-card nzTitle="操作日志" nzSize="small">
      @if (activity().length === 0) {
        <nz-empty nzNotFoundContent="暂无日志"></nz-empty>
      } @else {
        <ul class="activity-list">
          @for (line of activity(); track line) {
            <li>{{ line }}</li>
          }
        </ul>
      }
    </nz-card>
  `,
  styleUrl: './dynamic-playground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicPlaygroundComponent {
  readonly componentKeys = input.required<readonly LazyComponentId[]>();

  protected readonly eagerKey = COMPONENT_ID.eagerHealth;
  protected readonly componentMap = signal<ComponentMap>({});
  protected readonly errorMap = signal<ErrorMap>({});
  protected readonly loadingMap = signal<LoadingMap>({});
  protected readonly activity = signal<string[]>([]);
  protected readonly getComponentLabel = getComponentLabel;

  private readonly actionHandle = inject(ActionHandleService);

  protected loadStream(name: ComponentId): void {
    this.setLoading(name, true);
    this.actionHandle
      .create$(name)
      .pipe(
        take(1),
        finalize(() => this.setLoading(name, false))
      )
      .subscribe({
        next: (component) => {
          this.setComponent(name, component);
          this.setError(name, undefined);
          this.log(`[流式] 已解析 ${this.getComponentLabel(name)}`);
        },
        error: (error: unknown) => {
          this.setError(name, this.getErrorMessage(error));
          this.log(`[流式] 解析失败 ${this.getComponentLabel(name)}`);
        }
      });
  }

  protected loadSync(name: ComponentId): void {
    try {
      const component = this.actionHandle.createSync(name);
      this.setComponent(name, component);
      this.setError(name, undefined);
      this.log(`[同步] 已解析 ${this.getComponentLabel(name)}`);
    } catch (error: unknown) {
      this.setError(name, this.getErrorMessage(error));
      this.log(`[同步] 解析失败 ${this.getComponentLabel(name)}`);
    }
  }

  protected clear(name: ComponentId): void {
    this.setComponent(name, undefined);
    this.setError(name, undefined);
    this.setLoading(name, false);
    this.log(`[清空] ${this.getComponentLabel(name)}`);
  }

  private setComponent(name: ComponentId, component: Type<unknown> | undefined): void {
    this.componentMap.update((state) => ({
      ...state,
      [name]: component
    }));
  }

  private setError(name: ComponentId, message: string | undefined): void {
    this.errorMap.update((state) => ({
      ...state,
      [name]: message
    }));
  }

  private setLoading(name: ComponentId, value: boolean): void {
    this.loadingMap.update((state) => ({
      ...state,
      [name]: value
    }));
  }

  private log(message: string): void {
    this.activity.update((logs) => [new Date().toLocaleTimeString() + ` ${message}`, ...logs].slice(0, 20));
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
