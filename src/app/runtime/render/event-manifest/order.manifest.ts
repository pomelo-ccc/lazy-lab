import { EVENT_ID } from '../../type/event-id';

import { createLazyEventManifestFactory } from './event-manifest.utils';

const path = () => import('../../modules/events/order-events.actions');

const eventGroup = {
  creation: [
    EVENT_ID.createOrder,
  ],
  lifecycle: [
    EVENT_ID.confirmOrder,
    EVENT_ID.shipOrder,
  ],
  exception: [
    EVENT_ID.cancelOrder,
  ]
} as const;

export const createOrderLazyEventManifest = createLazyEventManifestFactory(
  path,
  eventGroup
);
