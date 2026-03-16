import { Injectable } from '@angular/core';

import { RuntimeEvent } from '../../core/event-contract';
import { EventPayloadMapFromMethods, EventResultMapFromMethods } from '../../type/event-type-helpers';

interface ProductPayload {
  readonly productId: string;
  readonly productName: string;
}

interface AdjustPricePayload extends ProductPayload {
  readonly newPrice: number;
}

interface AdjustPriceResult {
  readonly previousPrice: number;
  readonly newPrice: number;
}

type ProductEvent = RuntimeEvent<ProductPayload>;
type AdjustPriceEvent = RuntimeEvent<AdjustPricePayload>;

@Injectable({ providedIn: 'root' })
export class ProductEventsActions {
  publishProduct(event: ProductEvent): void {
    console.log(`[ProductEvents] 上架产品 ${event.productId}`);
  }

  unpublishProduct(event: ProductEvent): void {
    console.log(`[ProductEvents] 下架产品 ${event.productId}`);
  }

  adjustPrice(event: AdjustPriceEvent): AdjustPriceResult {
    return { previousPrice: 0, newPrice: event.newPrice };
  }
}

// ─── 局部 map 片段 ────────────────────────────────────────────────────────────

export type ProductEventPayloadMap = EventPayloadMapFromMethods<ProductEventsActions>;

export type ProductEventResultMap = EventResultMapFromMethods<ProductEventsActions>;
