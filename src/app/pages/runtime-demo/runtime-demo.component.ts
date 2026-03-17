import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { RuntimeDynamicComponent } from '../../runtime/render/runtime-component.component';
import {
  ComponentEmptyDirective,
  ComponentErrorDirective,
  ComponentLoadingDirective
} from '../../runtime/render/runtime-component-slots.directive';
import { COMPONENT_ID } from '../../runtime/type/component-id';
import { EVENT_ID } from '../../runtime/type/event-id';
import { RuntimeTableConfig } from '../../runtime/type/runtime-table-config';

interface TableScene {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly config: RuntimeTableConfig;
}

const COMPONENT_USAGE_SNIPPET = `<component
  is="user-profile-card"
  [props]="{ userId: 'u001' }"
  source="runtime-demo:example-user-profile"
></component>`;

const COMPONENT_SLOT_USAGE_SNIPPET = `<component
  [is]="COMPONENT_ID.runtimeTable"
  [props]="{ config: scene.config }"
  [key]="componentKeyMap()[scene.key] ?? 0"
>
  <ng-template componentLoading let-is="is">
    <nz-tag nzColor="processing">自定义 loading: {{ is }}</nz-tag>
  </ng-template>

  <ng-template componentError let-error="error">
    <nz-alert nzType="error" [nzDescription]="error" nzShowIcon></nz-alert>
  </ng-template>
</component>`;

@Component({
  standalone: true,
  selector: 'app-runtime-demo',
  imports: [
    JsonPipe,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzEmptyModule,
    NzTagModule,
    NzTypographyModule,
    RuntimeDynamicComponent,
    ComponentLoadingDirective,
    ComponentErrorDirective,
    ComponentEmptyDirective
  ],
  template: `
    <section class="runtime-demo-page">
      <nz-card class="hero-card">
        <h2 nz-typography>Table / Toolbar / Button Runtime</h2>
        <p nz-typography>
          页面只持有 <code>component id</code> 和配置，直接通过 <code>&lt;component is="..."&gt;</code> 声明式渲染。
          table 会根据自己的配置决定是否继续懒加载 <code>toolbar</code>，toolbar 再统一懒加载 <code>p-button</code>。
          <code>p-button</code> 内部会根据类型再决定加载文字按钮还是图标按钮文件。按钮点击时只知道
          <code>eventId</code>，runtime 会动态导入事件模块并执行对应方法。
        </p>

        <div class="tag-row">
          <nz-tag nzColor="processing">{{ COMPONENT_ID.runtimeTable }}</nz-tag>
          <nz-tag nzColor="blue">{{ COMPONENT_ID.runtimeToolbar }}</nz-tag>
          <nz-tag nzColor="cyan">{{ COMPONENT_ID.runtimeButton }}</nz-tag>
          <nz-tag nzColor="geekblue">{{ EVENT_ID.reloadTable }}</nz-tag>
          <nz-tag nzColor="geekblue">{{ EVENT_ID.exportRows }}</nz-tag>
          <nz-tag nzColor="geekblue">{{ EVENT_ID.archiveRows }}</nz-tag>
        </div>

        <div class="actions-row">
          <button nz-button nzType="primary" (click)="reloadAll()">重新加载所有 component 场景</button>
        </div>
      </nz-card>

      <nz-card nzTitle="最小使用示例" nzSize="small" class="example-card">
        <p nz-typography>
          下面这个例子不需要手动调用 <code>RenderService</code>，模板里直接写一个
          <code>&lt;component is="..."&gt;</code> 就能按 <code>is</code> 异步解析并渲染组件。
        </p>

        <pre class="payload-block">{{ componentUsageSnippet }}</pre>

        <div class="example-preview">
          <component
            is="user-profile-card"
            [props]="{ userId: 'u001' }"
            source="runtime-demo:example-user-profile"
          ></component>
        </div>
      </nz-card>

      <nz-card nzTitle="插槽式状态定制" nzSize="small" class="example-card">
        <p nz-typography>
          这个例子展示了 Angular 里最接近 Vue slot 的写法。你可以通过
          <code>componentLoading</code>、<code>componentError</code>、<code>componentEmpty</code>
          覆盖默认状态展示。
        </p>

        <pre class="payload-block">{{ componentSlotUsageSnippet }}</pre>

        <div class="example-preview">
          <component
            [is]="COMPONENT_ID.runtimeTable"
            [props]="{ config: scenes[0].config }"
            [key]="slotExampleKey()"
            source="runtime-demo:slot-example"
          >
            <ng-template componentLoading let-is="is">
              <div class="slot-state">
                <nz-tag nzColor="processing">自定义 loading: {{ is }}</nz-tag>
              </div>
            </ng-template>

            <ng-template componentError let-error="error">
              <nz-alert nzType="error" [nzDescription]="'自定义错误: ' + error" nzShowIcon></nz-alert>
            </ng-template>

            <ng-template componentEmpty let-is="is">
              <div class="slot-state">
                <nz-tag nzColor="default">component {{ is }} 当前为空</nz-tag>
              </div>
            </ng-template>
          </component>
        </div>

        <div class="actions-row">
          <button nz-button nzType="default" (click)="reloadSlotExample()">重新触发 slot 示例</button>
        </div>
      </nz-card>

      <section class="runtime-grid">
        @for (scene of scenes; track scene.key) {
          <nz-card [nzTitle]="scene.title" nzSize="small">
            <p nz-typography>{{ scene.description }}</p>
            <pre class="payload-block">{{ scene.config | json }}</pre>

            <div class="actions-row">
              <button nz-button nzType="primary" (click)="loadScene(scene)">
                {{ activeSceneMap()[scene.key] ? '重新加载 table' : '加载 table' }}
              </button>
            </div>

            @if (activeSceneMap()[scene.key]) {
              <div class="runtime-slot">
                <component
                  [is]="COMPONENT_ID.runtimeTable"
                  [props]="{ config: scene.config }"
                  [source]="'runtime-demo:' + scene.key"
                  [key]="componentKeyMap()[scene.key] ?? 0"
                ></component>
              </div>
            } @else {
              <nz-empty nzNotFoundContent="点击“加载 table”后，由 runtime 解析 table 组件"></nz-empty>
            }
          </nz-card>
        }
      </section>
    </section>
  `,
  styleUrl: './runtime-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuntimeDemoComponent {
  protected readonly COMPONENT_ID = COMPONENT_ID;
  protected readonly EVENT_ID = EVENT_ID;
  protected readonly componentUsageSnippet = COMPONENT_USAGE_SNIPPET;
  protected readonly componentSlotUsageSnippet = COMPONENT_SLOT_USAGE_SNIPPET;
  protected readonly scenes: ReadonlyArray<TableScene> = [
    {
      key: 'orders-text-toolbar',
      title: '场景 A: 只使用文字按钮',
      description: '先加载 table，再在 table 内部点击“显示 toolbar”。这个 toolbar 只会继续解析 p-button，再由 p-button 加载文字按钮文件。',
      config: {
        id: 'orders-table',
        title: '订单列表',
        summary: '文字按钮版本。适合验证 toolbar 内部只使用 text button 时，不会触发 icon button 文件。',
        columns: [
          { key: 'orderNo', label: '订单号' },
          { key: 'owner', label: '负责人' },
          { key: 'status', label: '状态' }
        ],
        rows: [
          {
            id: 'o-1001',
            cells: {
              orderNo: 'SO-1001',
              owner: '林安',
              status: '待确认'
            }
          },
          {
            id: 'o-1002',
            cells: {
              orderNo: 'SO-1002',
              owner: '周予',
              status: '处理中'
            }
          },
          {
            id: 'o-1003',
            cells: {
              orderNo: 'SO-1003',
              owner: '苏明',
              status: '已完成'
            }
          }
        ],
        toolbar: {
          title: '订单操作栏',
          buttons: [
            { id: 'reload', label: '刷新', eventId: EVENT_ID.reloadTable, buttonType: 'default' },
            { id: 'export', label: '导出', eventId: EVENT_ID.exportRows, buttonType: 'primary' },
            { id: 'archive', label: '归档', eventId: EVENT_ID.archiveRows, buttonType: 'dashed' }
          ]
        }
      }
    },
    {
      key: 'assets-mixed-toolbar',
      title: '场景 B: 图标按钮 + 文字按钮混用',
      description: '这个 toolbar 同时包含 icon button 和 text button，首次展开时会由 p-button 分别解析两种按钮文件。',
      config: {
        id: 'assets-table',
        title: '资产台账',
        summary: '混合按钮版本。用于验证 p-button 可以根据类型定位不同的按钮实现文件。',
        columns: [
          { key: 'assetName', label: '资产名称' },
          { key: 'keeper', label: '保管人' },
          { key: 'updatedAt', label: '更新时间' }
        ],
        rows: [
          {
            id: 'a-1',
            cells: {
              assetName: '主仓货架 A',
              keeper: '李楠',
              updatedAt: '2026-03-12'
            }
          },
          {
            id: 'a-2',
            cells: {
              assetName: '备用扫码枪',
              keeper: '赵可',
              updatedAt: '2026-03-11'
            }
          }
        ],
        toolbar: {
          title: '资产操作栏',
          buttons: [
            {
              id: 'reload-assets',
              label: '刷新资产',
              eventId: EVENT_ID.reloadTable,
              kind: 'icon',
              icon: 'reload'
            },
            {
              id: 'export-assets',
              label: '导出资产',
              eventId: EVENT_ID.exportRows,
              kind: 'icon',
              icon: 'download',
              buttonType: 'primary'
            },
            {
              id: 'archive-assets',
              label: '归档资产',
              eventId: EVENT_ID.archiveRows,
              buttonType: 'dashed'
            }
          ]
        }
      }
    }
  ];
  protected readonly activeSceneMap = signal<Partial<Record<string, boolean>>>({});
  protected readonly componentKeyMap = signal<Partial<Record<string, number>>>({});
  protected readonly slotExampleKey = signal(0);

  protected reloadAll(): void {
    for (const scene of this.scenes) {
      this.loadScene(scene);
    }
  }

  protected loadScene(scene: TableScene): void {
    this.activeSceneMap.update((state) => ({
      ...state,
      [scene.key]: true
    }));
    this.componentKeyMap.update((state) => ({
      ...state,
      [scene.key]: (state[scene.key] ?? 0) + 1
    }));
  }

  protected reloadSlotExample(): void {
    this.slotExampleKey.update((value) => value + 1);
  }
}
