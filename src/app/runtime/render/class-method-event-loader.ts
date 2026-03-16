import { Injector, Type } from '@angular/core';
import { Observable, defer, map } from 'rxjs';

import { EventHandler, EventHandlerResult, RuntimeEvent } from '../core/event-contract';
import { EventId } from '../type/event-id';

type EventMethod<TId extends EventId> = (
  event: RuntimeEvent<any>
) => EventHandlerResult<unknown>;

/**
 * 创建懒加载事件 loader。
 *
 * @param importService 动态 import 并返回 service class 的函数，例如：
 *   `() => import('./order-events.actions').then(m => m.OrderEventsActions)`
 *   这样 bundler 可以将该模块分割为独立 chunk，不会污染 initial bundle。
 * @param methodName    service 上对应的方法名（同时充当 EventId）
 * @param injector      Angular Injector，用于在模块加载后获取 service 实例
 */
export function createClassMethodEventLoader<TId extends EventId, TService extends object>(
  importService: () => Promise<Type<TService>>,
  methodName: keyof TService & string,
  injector: Injector
): () => Observable<EventHandler<TId>> {
  return () =>
    defer(importService).pipe(
      map((serviceToken) => {
        const service = injector.get(serviceToken);
        const candidate = service[methodName];

        if (typeof candidate !== 'function') {
          throw new Error(`[RuntimeEventMethodError] method="${methodName}" 不存在或不是函数。`);
        }

        const method = candidate as unknown as EventMethod<TId>;

        return ((request) =>
          method.call(service, {
            ...(request.payload as object),
            context: request.context
          })) as EventHandler<TId>;
      })
    );
}
