import { Injector } from '@angular/core';

import { EventHandler } from '../../core/event-contract';
import { EventManifestEntry, SyncEventManifestEntry } from '../../core/event-registry';
import { EventId } from '../../type/event-id';

import { createClassMethodEventLoader } from '../class-method-event-loader';

/**
 * 绑定 importService + 方法名列表，直接返回该域的所有 EventManifestEntry。
 * 方法名同时充当 EventId（两者值相同时成立，即键名 === 字符串值的事件）。
 * 同一业务域的多个事件只需声明 importService 一次，方法名写一遍即可。
 *
 * @param importService 动态 import 并返回 service class 的函数，例如：
 *   `() => import('./order-events.actions').then(m => m.OrderEventsActions)`
 *   bundler 会将该模块分割为独立 chunk，不污染 initial bundle。
 */
export function domainEntries<TService extends object>(
  importService: () => Promise<new (...args: never[]) => TService>,
  injector: Injector,
  methods: ReadonlyArray<keyof TService & EventId>
): ReadonlyArray<EventManifestEntry> {
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
