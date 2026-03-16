import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { createRuntimeContext } from '../../core/runtime-context';
import { EventRuntimeService } from '../../render/event-runtime.service';
import {
  RuntimeButtonInput,
  RuntimeToolbarActionRecord
} from '../../type/runtime-table-config';

@Injectable({
  providedIn: 'root'
})
export class PButtonActionService {
  private readonly eventRuntime = inject(EventRuntimeService);

  execute$(input: RuntimeButtonInput): Observable<RuntimeToolbarActionRecord> {
    return this.eventRuntime
      .dispatch$({
        eventId: input.config.eventId,
        payload: {
          tableId: input.table.id,
          tableTitle: input.table.title,
          buttonId: input.config.id,
          buttonLabel: input.config.label,
          rowCount: input.table.rowCount
        },
        context: createRuntimeContext(`p-button:${input.config.id}`)
      })
      .pipe(
        map((response) => ({
          ...response.result,
          eventId: response.eventId,
          buttonLabel: input.config.label
        }))
      );
  }
}
