import { Type } from '@angular/core';

import { ComponentId } from '../type/component-id';
import { ComponentInputMap } from '../type/component-input-map';

import { RuntimeContext } from './runtime-context';

export interface ComponentRenderRequest<TId extends ComponentId = ComponentId> {
  readonly componentId: TId;
  readonly input: ComponentInputMap[TId] & Record<string, unknown>;
  readonly context: RuntimeContext;
}

export interface ComponentRenderResponse<TId extends ComponentId = ComponentId> {
  readonly componentId: TId;
  readonly component: Type<unknown>;
  readonly input: ComponentInputMap[TId] & Record<string, unknown>;
  readonly context: RuntimeContext;
}
