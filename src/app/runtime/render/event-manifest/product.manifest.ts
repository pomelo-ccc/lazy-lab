import { EVENT_ID } from '../../type/event-id';

import { createLazyEventManifestFactory } from './event-manifest.utils';

const path = () => import('../../modules/events/product-events.actions');

const eventGroup = {
  publishing: [
    EVENT_ID.publishProduct,
    EVENT_ID.unpublishProduct,
  ],
  pricing: [
    EVENT_ID.adjustPrice,
  ]
} as const;

export const createProductLazyEventManifest = createLazyEventManifestFactory(
  path,
  eventGroup
);
