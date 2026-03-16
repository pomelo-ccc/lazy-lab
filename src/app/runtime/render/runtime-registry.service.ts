import { Injectable, Injector, Type, inject } from '@angular/core';
import {
  Observable,
  catchError,
  defer,
  map,
  of,
  shareReplay,
  take,
  tap,
  throwError
} from 'rxjs';

import {
  ComponentLoader,
  ComponentManifestEntry,
  ComponentRegistry,
  RegisterRegistryOptions
} from '../core/component-registry';
import { EventHandler } from '../core/event-contract';
import {
  EventLoader,
  EventManifestEntry,
  EventRegistry,
  SyncEventManifestEntry
} from '../core/event-registry';
import { ALL_COMPONENT_IDS, ComponentId } from '../type/component-id';
import { ALL_EVENT_IDS, EventId } from '../type/event-id';

import {
  RUNTIME_COMPONENT_MANIFEST,
  createRuntimeLazyEventManifest,
  createRuntimeSyncEventManifest
} from './runtime-manifest';

interface LazyResourceEntry<TValue> {
  loader: () => Observable<TValue>;
  loading$?: Observable<TValue>;
  resolved?: TValue;
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeRegistryService implements ComponentRegistry, EventRegistry {
  private readonly componentEntries = new Map<ComponentId, LazyResourceEntry<Type<unknown>>>();
  private readonly eventEntries = new Map<EventId, LazyResourceEntry<EventHandler>>();

  private readonly injector = inject(Injector);

  constructor() {
    this.installComponentManifest(RUNTIME_COMPONENT_MANIFEST);
    this.installEventManifest(
      createRuntimeLazyEventManifest(this.injector),
      createRuntimeSyncEventManifest(this.injector)
    );
  }

  registerComponent(
    id: ComponentId,
    loader: ComponentLoader,
    options: RegisterRegistryOptions = {}
  ): void {
    this.upsertEntry(this.componentEntries, id, loader, options, 'component');
  }

  registerEvent<TId extends EventId>(
    id: TId,
    loader: EventLoader<TId>,
    options: RegisterRegistryOptions = {}
  ): void {
    this.upsertEntry(
      this.eventEntries,
      id,
      loader as unknown as () => Observable<EventHandler>,
      options,
      'event'
    );
  }

  registerSyncEvent<TId extends EventId>(
    id: TId,
    handler: EventHandler<TId>,
    options: RegisterRegistryOptions = {}
  ): void {
    // 将同步 handler 包装为始终命中缓存的 lazy entry
    this.upsertEntry(
      this.eventEntries,
      id,
      () => of(handler as unknown as EventHandler),
      options,
      'event'
    );
    // 直接标记为 resolved，跳过任何异步流程
    const entry = this.eventEntries.get(id)!;
    entry.resolved = handler as unknown as EventHandler;
  }

  resolveComponent$(id: ComponentId): Observable<Type<unknown>> {
    return this.resolveEntry$(this.componentEntries, id, 'component');
  }

  resolveEventHandler$<TId extends EventId>(id: TId): Observable<EventHandler<TId>> {
    return this.resolveEntry$(this.eventEntries, id, 'event').pipe(
      map((handler) => handler as unknown as EventHandler<TId>)
    );
  }

  private installComponentManifest(manifest: ReadonlyArray<ComponentManifestEntry>): void {
    validateManifest('component', ALL_COMPONENT_IDS, manifest);

    for (const entry of manifest) {
      this.registerComponent(entry.id, entry.loader);
    }
  }

  private installEventManifest(
    lazyManifest: ReadonlyArray<EventManifestEntry>,
    syncManifest: ReadonlyArray<SyncEventManifestEntry>
  ): void {
    const combined = [...lazyManifest, ...syncManifest];
    validateManifest('event', ALL_EVENT_IDS, combined);

    for (const entry of lazyManifest) {
      this.registerEvent(entry.id, entry.loader);
    }
    for (const entry of syncManifest) {
      this.registerSyncEvent(entry.id, entry.handler);
    }
  }

  private upsertEntry<TId extends string, TValue>(
    entries: Map<TId, LazyResourceEntry<TValue>>,
    id: TId,
    loader: () => Observable<TValue>,
    options: RegisterRegistryOptions,
    kind: 'component' | 'event'
  ): void {
    if (entries.has(id) && !options.override) {
      throw new Error(
        `[RuntimeRegistryDuplicateError] ${kind}="${id}" already registered. ` +
          '如需覆盖，请显式传入 { override: true }。'
      );
    }

    entries.set(id, { loader });
  }

  private resolveEntry$<TId extends string, TValue>(
    entries: Map<TId, LazyResourceEntry<TValue>>,
    id: TId,
    kind: 'component' | 'event'
  ): Observable<TValue> {
    const entry = entries.get(id);

    if (!entry) {
      return throwError(
        () => new Error(`[RuntimeRegistryResolveError] ${kind}="${id}" 未注册。`)
      );
    }

    if (entry.resolved) {
      return of(entry.resolved);
    }

    if (entry.loading$) {
      return entry.loading$;
    }

    const loading$ = defer(() => entry.loader()).pipe(
      take(1),
      tap((resource) => {
        if (!resource) {
          throw new Error('loader 返回了空值。');
        }

        entry.resolved = resource;
        entry.loading$ = undefined;
      }),
      catchError((error: unknown) => {
        entry.loading$ = undefined;
        return throwError(
          () =>
            new Error(
              `[RuntimeRegistryResolveError] ${kind}="${id}" 懒加载失败：${toErrorMessage(error)}`,
              {
                cause: error instanceof Error ? error : undefined
              }
            )
        );
      }),
      shareReplay({
        bufferSize: 1,
        refCount: false
      })
    );

    entry.loading$ = loading$;
    return loading$;
  }
}

function validateManifest<TId extends string>(
  kind: 'component' | 'event',
  expectedIds: readonly TId[],
  manifest: ReadonlyArray<{ id: TId }>
): void {
  const expectedSet = new Set<TId>(expectedIds);
  const seenSet = new Set<TId>();

  for (const entry of manifest) {
    if (!expectedSet.has(entry.id)) {
      throw new Error(
        `[RuntimeManifestError] ${kind}="${entry.id}" 未在 ${kind.toUpperCase()}_ID 中声明。`
      );
    }

    if (seenSet.has(entry.id)) {
      throw new Error(`[RuntimeManifestError] 检测到重复 ${kind} loader，id="${entry.id}"。`);
    }

    seenSet.add(entry.id);
  }

  for (const expectedId of expectedSet) {
    if (!seenSet.has(expectedId)) {
      throw new Error(`[RuntimeManifestError] 缺少 ${kind} loader，id="${expectedId}"。`);
    }
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
