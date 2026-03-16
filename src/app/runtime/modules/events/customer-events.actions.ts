import { Injectable } from '@angular/core';

import { RuntimeEvent } from '../../core/event-contract';
import { EventPayloadMapFromMethods, EventResultMapFromMethods } from '../../type/event-type-helpers';

interface CustomerPayload {
  readonly customerId: string;
  readonly customerName: string;
}

interface UpdateCustomerTagPayload extends CustomerPayload {
  readonly tags: readonly string[];
}

interface UpdateCustomerTagResult {
  readonly updatedTags: readonly string[];
}

type CustomerEvent = RuntimeEvent<CustomerPayload>;
type UpdateCustomerTagEvent = RuntimeEvent<UpdateCustomerTagPayload>;

@Injectable({ providedIn: 'root' })
export class CustomerEventsActions {
  viewCustomer(event: CustomerEvent): void {
    console.log(`[CustomerEvents] 查看客户 ${event.customerId}`);
  }

  updateCustomerTag(event: UpdateCustomerTagEvent): UpdateCustomerTagResult {
    return { updatedTags: event.tags };
  }
}

// ─── 局部 map 片段 ────────────────────────────────────────────────────────────

export type CustomerEventPayloadMap = EventPayloadMapFromMethods<CustomerEventsActions>;

export type CustomerEventResultMap = EventResultMapFromMethods<CustomerEventsActions>;
