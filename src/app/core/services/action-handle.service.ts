import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ComponentNotPreloadedError,
  getComponentSource,
  resolveComponent,
  resolveComponentSync
} from '../decorator/dpp-new-event';

@Injectable({
  providedIn: 'root'
})
export class ActionHandleService {
  create$(name: string): Observable<Type<unknown>> {
    return resolveComponent(name);
  }

  createSync(name: string): Type<unknown> {
    const component = resolveComponentSync(name);

    if (component) {
      return component;
    }

    throw new ComponentNotPreloadedError(name, getComponentSource(name));
  }

  openModal$(name: string): Observable<Type<unknown>> {
    return this.create$(name);
  }

  openDrawer$(name: string): Observable<Type<unknown>> {
    return this.create$(name);
  }

  invoke$(name: string): Observable<Type<unknown>> {
    return this.create$(name);
  }
}
