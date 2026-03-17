import { EVENT_ID } from '../../type/event-id';

import { createLazyEventManifestFactory } from './event-manifest.utils';

const path = () => import('../../modules/events/table-events.actions');

const eventGroup = {
  query: [
    EVENT_ID.reloadTable,
  ],
  export: [
    EVENT_ID.exportRows,
    EVENT_ID.printRows,
  ],
  bulkMutation: [
    EVENT_ID.archiveRows,
    EVENT_ID.batchDelete,
  ]
} as const;

export const createTableLazyEventManifest = createLazyEventManifestFactory(
  path,
  eventGroup
);
