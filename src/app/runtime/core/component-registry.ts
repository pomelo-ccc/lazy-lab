import { Type } from '@angular/core';
import { Observable } from 'rxjs';

import { ComponentId } from '../type/component-id';

export interface RegisterRegistryOptions {
  readonly override?: boolean;
}

export type ComponentLoader = () => Observable<Type<unknown>>;

export interface ComponentManifestEntry {
  readonly id: ComponentId;
  readonly loader: ComponentLoader;
}

export interface ComponentRegistry {
  registerComponent(id: ComponentId, loader: ComponentLoader, options?: RegisterRegistryOptions): void;
  resolveComponent$(id: ComponentId): Observable<Type<unknown>>;
}
