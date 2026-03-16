import { Type } from '@angular/core';
import { Observable, catchError, defer, of, shareReplay, take, tap, throwError } from 'rxjs';

export const comNewObj: { data: Record<string, unknown> } = {
  data: {}
};

interface ComponentRegistryEntry {
  ctor?: Type<unknown>;
  loader?: () => Observable<Type<unknown>>;
  loading$?: Observable<Type<unknown>>;
  resolved?: Type<unknown>;
}

export interface RegisterOptions {
  override?: boolean;
}

export type ComponentSource = 'eager' | 'lazy' | 'both' | 'none';

const componentRegistry = new Map<string, ComponentRegistryEntry>();

export class ComponentNotPreloadedError extends Error {
  constructor(name: string, source: ComponentSource) {
    super(
      `[ComponentNotPreloadedError] component="${name}" source="${source}". ` +
        '该组件在同步调用路径下属于懒加载组件，当前尚未预加载。' +
        '请迁移到流式接口 openModal$/openDrawer$/create$/invoke$，' +
        `或在同步调用前先执行 resolveComponent("${name}")。`
    );
    this.name = 'ComponentNotPreloadedError';
  }
}

export function registerEagerComponent(
  name: string,
  ctor: Type<unknown>,
  options: RegisterOptions = {}
): void {
  upsertEntry(name, { ctor, resolved: ctor }, options);
  comNewObj.data[name] = ctor;
}

export function registerNewComLazy(
  name: string,
  loader: () => Observable<Type<unknown>>,
  options: RegisterOptions = {}
): void {
  upsertEntry(name, { loader }, options);

  if (options.override) {
    delete comNewObj.data[name];
  }
}

export function getComponentSource(name: string): ComponentSource {
  const entry = componentRegistry.get(name);

  if (!entry) {
    return 'none';
  }

  const hasEager = Boolean(entry.ctor);
  const hasLazy = Boolean(entry.loader);

  if (hasEager && hasLazy) {
    return 'both';
  }

  if (hasEager) {
    return 'eager';
  }

  if (hasLazy) {
    return 'lazy';
  }

  return 'none';
}

export function resolveComponent(name: string): Observable<Type<unknown>> {

  const entry = componentRegistry.get(name);

  if (!entry) {
    return throwError(() =>
      buildResolveError(name, 'none', '组件未注册，请使用 registerEagerComponent() 或 registerNewComLazy()。')
    );
  }

  if (entry.resolved) {
    return of(entry.resolved);
  }

  if (entry.ctor) {
    entry.resolved = entry.ctor;
    comNewObj.data[name] = entry.ctor;
    return of(entry.ctor);
  }

  if (!entry.loader) {
    return throwError(() =>
      buildResolveError(name, getComponentSource(name), '注册表条目缺少 ctor 和 loader。')
    );
  }

  if (entry.loading$) {
    return entry.loading$;
  }

  const loading$ = defer(() => entry.loader!()).pipe(
    take(1),
    tap((loadedCtor) => {
      if (!loadedCtor) {
        throw new Error('Loader 返回了空的组件类型。');
      }

      entry.resolved = loadedCtor;
      entry.loading$ = undefined;
      comNewObj.data[name] = loadedCtor;
    }),
    catchError((error: unknown) => {
      entry.loading$ = undefined;
      return throwError(() =>
        buildResolveError(
          name,
          getComponentSource(name),
          `懒加载组件加载失败：${toErrorMessage(error)}`,
          error
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

export function resolveComponentSync(name: string): Type<unknown> | undefined {
  const entry = componentRegistry.get(name);

  if (!entry) {
    return undefined;
  }

  const resolved = entry.resolved ?? entry.ctor;

  if (resolved) {
    comNewObj.data[name] = resolved;
  }

  return resolved;
}

export function resolveComponentSyncOrThrow(name: string): Type<unknown> {
  const component = resolveComponentSync(name);

  if (component) {
    return component;
  }

  throw new ComponentNotPreloadedError(name, getComponentSource(name));
}

export function __resetRegistryForTests(): void {
  componentRegistry.clear();
  comNewObj.data = {};
}

function upsertEntry(
  name: string,
  incoming: Partial<ComponentRegistryEntry>,
  options: RegisterOptions
): ComponentRegistryEntry {
  const existing = componentRegistry.get(name);

  const hasCtorConflict = Boolean(existing?.ctor && incoming.ctor);
  const hasLoaderConflict = Boolean(existing?.loader && incoming.loader);

  if (existing && !options.override && (hasCtorConflict || hasLoaderConflict)) {
    throw new Error(
      `[ComponentRegistryDuplicateError] component="${name}" already registered. ` +
        '如需覆盖，请显式传入 { override: true }。'
    );
  }

  const next: ComponentRegistryEntry = options.override ? { ...incoming } : { ...existing, ...incoming };
  componentRegistry.set(name, next);
  return next;
}

function buildResolveError(
  name: string,
  source: ComponentSource,
  reason: string,
  cause?: unknown
): Error {
  return new Error(
    `[ComponentResolveError] component="${name}" source="${source}". ${reason} ` +
      '迁移建议：请将调用方改为流式接口（openModal$/openDrawer$/create$/invoke$）。',
    {
      cause: cause instanceof Error ? cause : undefined
    }
  );
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
