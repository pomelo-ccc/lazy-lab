import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { finalize, take } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { RuntimeContext, createRuntimeContext } from '../core/runtime-context';
import { ComponentRenderResponse } from '../core/render-contract';
import { ComponentInputMap } from '../type/component-input-map';
import { ComponentId } from '../type/component-id';

import { RenderService } from './render.service';
import {
  ComponentEmptyDirective,
  ComponentErrorDirective,
  ComponentLoadingDirective
} from './runtime-component-slots.directive';

type ComponentProps = ComponentInputMap[ComponentId] & Record<string, unknown>;

@Component({
  selector: 'component',
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    NzAlertModule,
    NzEmptyModule,
    NzTagModule
  ],
  template: `
    @if (error(); as errorText) {
      @if (errorTemplate(); as templateRef) {
        <ng-container
          *ngTemplateOutlet="templateRef; context: errorTemplateContext()"
        ></ng-container>
      } @else {
        <nz-alert nzType="error" [nzDescription]="errorText" nzShowIcon></nz-alert>
      }
    } @else if (loading()) {
      @if (loadingTemplate(); as templateRef) {
        <ng-container
          *ngTemplateOutlet="templateRef; context: stateTemplateContext()"
        ></ng-container>
      } @else {
        <div class="render-status">
          <nz-tag nzColor="processing">component 正在解析 {{ is() }}</nz-tag>
        </div>
      }
    } @else if (response(); as view) {
      <ng-container *ngComponentOutlet="view.component; inputs: view.input"></ng-container>
    } @else {
      @if (emptyTemplate(); as templateRef) {
        <ng-container
          *ngTemplateOutlet="templateRef; context: stateTemplateContext()"
        ></ng-container>
      } @else {
        <nz-empty nzNotFoundContent="component 未解析到可用组件"></nz-empty>
      }
    }
  `,
  styleUrl: './runtime-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuntimeDynamicComponent {
  readonly is = input.required<ComponentId>();
  readonly props = input<ComponentProps | undefined>(undefined);
  readonly context = input<RuntimeContext | undefined>();
  readonly source = input('component');
  readonly key = input<unknown>(0);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | undefined>(undefined);
  protected readonly response = signal<ComponentRenderResponse<ComponentId> | null>(null);
  protected readonly loadingTemplate = computed(
    () => this.loadingSlot()?.templateRef
  );
  protected readonly errorTemplate = computed(
    () => this.errorSlot()?.templateRef
  );
  protected readonly emptyTemplate = computed(
    () => this.emptySlot()?.templateRef
  );
  protected readonly stateTemplateContext = computed(() => ({
    $implicit: this.is(),
    is: this.is(),
    source: this.source()
  }));
  protected readonly errorTemplateContext = computed(() => ({
    ...this.stateTemplateContext(),
    error: this.error() ?? '未知错误'
  }));

  private readonly injector = inject(Injector);
  private readonly renderService = inject(RenderService);
  private readonly loadingSlot = contentChild(ComponentLoadingDirective);
  private readonly errorSlot = contentChild(ComponentErrorDirective);
  private readonly emptySlot = contentChild(ComponentEmptyDirective);
  private requestVersion = 0;

  constructor() {
    effect(
      (onCleanup) => {
        const componentId = this.is();
        const componentProps = this.props() ?? ({} as ComponentProps);
        const componentContext =
          this.context() ?? createRuntimeContext(`${this.source()}:${componentId}`);

        this.key();

        const requestVersion = ++this.requestVersion;
        this.loading.set(true);
        this.error.set(undefined);
        this.response.set(null);

        const sub = this.renderService
          .render$({
            componentId,
            input: componentProps,
            context: componentContext
          })
          .pipe(
            take(1),
            finalize(() => {
              if (requestVersion === this.requestVersion) {
                this.loading.set(false);
              }
            })
          )
          .subscribe({
            next: (response) => {
              if (requestVersion !== this.requestVersion) {
                return;
              }

              this.response.set(response);
            },
            error: (error: unknown) => {
              if (requestVersion !== this.requestVersion) {
                return;
              }

              this.error.set(this.toErrorMessage(error));
            }
          });

        onCleanup(() => sub.unsubscribe());
      },
      { injector: this.injector }
    );
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
