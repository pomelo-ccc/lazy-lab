import { Injector } from '@angular/core';

import { EventHandler } from '../../core/event-contract';
import { EventManifestEntry, SyncEventManifestEntry } from '../../core/event-registry';
import { EventId } from '../../type/event-id';

import { createClassMethodEventLoader } from '../class-method-event-loader';

type Constructor<TInstance extends object = object> = new (...args: any[]) => TInstance;
type ActionsExportKey<TModule> = Extract<keyof TModule, `${string}Actions`>;
type ActionsService<TModule> =
  TModule[ActionsExportKey<TModule>] extends Constructor<infer TService> ? TService : never;
type DomainEventIds<TModule extends Record<string, unknown>> =
  ReadonlyArray<keyof ActionsService<TModule> & EventId>;
type DomainEventGroups<TModule extends Record<string, unknown>> = Readonly<
  Record<string, DomainEventIds<TModule>>
>;
type DomainEventCollection<TModule extends Record<string, unknown>> =
  | DomainEventIds<TModule>
  | DomainEventGroups<TModule>;

function normalizeDomainEventIds<TModule extends Record<string, unknown>>(
  collection: DomainEventCollection<TModule>
): DomainEventIds<TModule> {
  if (Array.isArray(collection)) {
    return collection;
  }

  return Object.values(collection).flat() as DomainEventIds<TModule>;
}

function resolveActionsClass<TModule extends Record<string, unknown>>(
  module: TModule
): Constructor<ActionsService<TModule>> {
  const actionsExports = Object.entries(module).filter(
    ([exportName, exportValue]) =>
      exportName.endsWith('Actions') && typeof exportValue === 'function'
  );

  if (actionsExports.length !== 1) {
    const exportNames = Object.keys(module);
    throw new Error(
      `[EventManifestModuleError] 期望模块只导出一个 *Actions 类，实际匹配到 ${actionsExports.length} 个。` +
        `exports=[${exportNames.join(', ')}]`
    );
  }

  return actionsExports[0][1] as Constructor<ActionsService<TModule>>;
}

/**
 * 绑定 importModule + 方法名列表，直接生成该模块的 lazy EventManifestEntry。
 * 方法名同时充当 EventId（两者值相同时成立，即键名 === 字符串值的事件）。
 * 同一业务域的多个事件只需声明 import 路径一次，方法名写一遍即可。
 *
 * @param importModule 动态 import 模块本身的函数，例如：
 *   `() => import('./order-events.actions')`
 *   utils 会按约定自动解析模块中唯一的 `*Actions` 类。
 * @param injector
 * @param methods
 */
export function buildLazyEventManifestEntries<TModule extends Record<string, unknown>>(
  importModule: () => Promise<TModule>,
  injector: Injector,
  methods: DomainEventIds<TModule>
): ReadonlyArray<EventManifestEntry> {
  const importService = () => importModule().then(resolveActionsClass);

  return methods.map((method) => ({
    id: method,
    loader: (createClassMethodEventLoader as Function)(
      importService,
      method,
      injector
    ) as EventManifestEntry['loader']
  }));
}

/**
 * 生成按需注入 injector 的 lazy event manifest 工厂。
 * 维护侧只关心 import 路径和事件列表；injector 在 runtime 装配阶段再传入。
 */
export function createLazyEventManifestFactory<TModule extends Record<string, unknown>>(
  importModule: () => Promise<TModule>,
  collection: DomainEventCollection<TModule>
): (injector: Injector) => ReadonlyArray<EventManifestEntry> {
  const eventIds = normalizeDomainEventIds(collection);

  return (injector) => buildLazyEventManifestEntries(importModule, injector, eventIds);
}

/**
 * 为已注入服务的某个方法构建一条同步 SyncEventManifestEntry。
 */
export function syncEntry<TService>(
  id: EventId,
  service: TService,
  method: keyof TService & string
): SyncEventManifestEntry {
  const fn = service[method] as unknown as EventHandler;
  return {
    id,
    handler: (request) => fn.call(service, request)
  };
}
