import { Type } from '@angular/core';
import { Observable } from 'rxjs';

import { LazyComponentId } from '../../../shared/component-ids';

export interface LazyManifestEntry {
  readonly id: LazyComponentId;
  readonly loader: () => Observable<Type<unknown>>;
}
