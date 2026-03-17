import { Type } from '@angular/core';
import { defer, map } from 'rxjs';

import { ComponentLoader, ComponentManifestEntry } from '../core/component-registry';
import { ComponentId } from '../type/component-id';

type ComponentModule = Record<string, unknown>;
type ComponentConstructor<TInstance = unknown> = Type<TInstance>;
type ComponentExportKey<TModule> = Extract<keyof TModule, `${string}Component`>;
type ComponentClass<TModule> =
  TModule[ComponentExportKey<TModule>] extends ComponentConstructor<infer TComponent>
    ? ComponentConstructor<TComponent>
    : never;
type LazyComponentPath<TModule extends ComponentModule = ComponentModule> = () => Promise<TModule>;
type LazyComponentPathMap = Readonly<Partial<Record<ComponentId, LazyComponentPath>>>;
type LazyComponentPathGroup = Readonly<Record<string, LazyComponentPathMap>>;

function resolveComponentClass<TModule extends ComponentModule>(
  module: TModule
): ComponentConstructor<ComponentClass<TModule>> {
  const componentExports = Object.entries(module).filter(
    ([exportName, exportValue]) =>
      exportName.endsWith('Component') && typeof exportValue === 'function'
  );

  if (componentExports.length !== 1) {
    const exportNames = Object.keys(module);
    throw new Error(
      `[ComponentManifestModuleError] 期望模块只导出一个 *Component 类，实际匹配到 ${componentExports.length} 个。` +
        `exports=[${exportNames.join(', ')}]`
    );
  }

  return componentExports[0][1] as ComponentConstructor<ComponentClass<TModule>>;
}

function createLazyComponentLoader<TModule extends ComponentModule>(
  importModule: LazyComponentPath<TModule>
): ComponentLoader {
  return () =>
    defer(importModule).pipe(
      map((module) => resolveComponentClass(module) as Type<unknown>)
    );
}

/**
 * 根据分组后的组件路径映射，统一生成 runtime component manifest。
 * 维护侧只需要维护组件 id 和对应的懒加载 import 路径。
 */
export function buildLazyComponentManifestEntries(
  pathGroup: LazyComponentPathGroup
): ReadonlyArray<ComponentManifestEntry> {
  return Object.values(pathGroup).flatMap((pathMap) =>
    Object.entries(pathMap).map(([id, path]) => ({
      id: id as ComponentId,
      loader: createLazyComponentLoader(path)
    }))
  );
}
