import { EVENT_ID } from '../../type/event-id';

import { createLazyEventManifestFactory } from './event-manifest.utils';

const path = () => import('../../modules/events/customer-events.actions');

const eventGroup = {
  profile: [
    EVENT_ID.viewCustomer,
  ],
  tagging: [
    EVENT_ID.updateCustomerTag,
  ]
} as const;

export const createCustomerLazyEventManifest = createLazyEventManifestFactory(
  path,
  eventGroup
);
