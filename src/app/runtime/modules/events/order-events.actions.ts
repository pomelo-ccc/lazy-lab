import { Injectable } from '@angular/core';
import { RuntimeEvent } from '../../core/event-contract';
import { EventPayloadMapFromMethods, EventResultMapFromMethods } from '../../type/event-type-helpers';

interface OrderPayload {
  readonly orderId: string;
  readonly orderNo: string;
}

interface CreateOrderPayload {
  readonly tableId: string;
}

interface CreateOrderResult {
  readonly orderId: string;
  readonly orderNo: string;
}

interface CancelOrderPayload extends OrderPayload {
  readonly reason: string;
}

interface ShipOrderPayload extends OrderPayload {
  readonly trackingNo: string;
}

interface ShipOrderResult {
  readonly estimatedDelivery: string;
}

type CreateOrderEvent = RuntimeEvent<CreateOrderPayload>;
type CancelOrderEvent = RuntimeEvent<CancelOrderPayload>;
type ConfirmOrderEvent = RuntimeEvent<OrderPayload>;
type ShipOrderEvent = RuntimeEvent<ShipOrderPayload>;

@Injectable({ providedIn: 'root' })
export class OrderEventsActions {
  createOrder(event: CreateOrderEvent): CreateOrderResult {
    const orderId = `ord-${event.context.requestId}`;
    return { orderId, orderNo: `NO-${Date.now()}` };
  }

  cancelOrder(event: CancelOrderEvent): void {
    console.log(`[OrderEvents] 取消订单 ${event.orderId}，原因：${event.reason}`);
  }

  confirmOrder(event: ConfirmOrderEvent): void {
    console.log(`[OrderEvents] 确认订单 ${event.orderId}`);
  }

  shipOrder(_event: ShipOrderEvent): ShipOrderResult {
    return { estimatedDelivery: '3-5 个工作日' };
  }
}

// ─── 局部 map 片段 ────────────────────────────────────────────────────────────

export type OrderEventPayloadMap = EventPayloadMapFromMethods<OrderEventsActions>;

export type OrderEventResultMap = EventResultMapFromMethods<OrderEventsActions>;
