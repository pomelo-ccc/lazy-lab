import { Observable } from 'rxjs';

import { EventId } from '../type/event-id';

import { EventHandler } from './event-contract';
import { RegisterRegistryOptions } from './component-registry';

// 懒加载：首次使用时才加载 chunk，返回 Observable
export type EventLoader<TId extends EventId = EventId> = () => Observable<EventHandler<TId>>;

export interface EventManifestEntry {
  readonly id: EventId;
  readonly loader: EventLoader;
}

// 同步：handler 在启动时已在内存中，直接注册
export interface SyncEventManifestEntry {
  readonly id: EventId;
  readonly handler: EventHandler;
}

export interface EventRegistry {
  registerEvent<TId extends EventId>(
    id: TId,
    loader: EventLoader<TId>,
    options?: RegisterRegistryOptions
  ): void;

  registerSyncEvent<TId extends EventId>(
    id: TId,
    handler: EventHandler<TId>,
    options?: RegisterRegistryOptions
  ): void;

  resolveEventHandler$<TId extends EventId>(id: TId): Observable<EventHandler<TId>>;
}
