import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiProxy } from '../core/api-proxy';
import { ComponentRenderRequest, ComponentRenderResponse } from '../core/render-contract';

import { RuntimeRegistryService } from './runtime-registry.service';

@Injectable({
  providedIn: 'root'
})
export class RenderService
  implements ApiProxy<ComponentRenderRequest, ComponentRenderResponse>
{
  private readonly runtimeRegistry = inject(RuntimeRegistryService);

  execute$<TId extends ComponentRenderRequest['componentId']>(
    request: ComponentRenderRequest<TId>
  ): Observable<ComponentRenderResponse<TId>> {
    return this.runtimeRegistry.resolveComponent$(request.componentId).pipe(
      map((component) => ({
        componentId: request.componentId,
        component,
        input: request.input,
        context: request.context
      }))
    );
  }

  render$<TId extends ComponentRenderRequest['componentId']>(
    request: ComponentRenderRequest<TId>
  ): Observable<ComponentRenderResponse<TId>> {
    return this.execute$(request);
  }
}
