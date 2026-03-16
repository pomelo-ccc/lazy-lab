import { AuditEventPayloadMap, AuditEventResultMap } from '../../modules/events/audit-events.actions';
import { CustomerEventPayloadMap, CustomerEventResultMap } from '../../modules/events/customer-events.actions';
import {
  NotificationEventPayloadMap,
  NotificationEventResultMap
} from '../../modules/events/notification-events.actions';
import { OrderEventPayloadMap, OrderEventResultMap } from '../../modules/events/order-events.actions';
import { ProductEventPayloadMap, ProductEventResultMap } from '../../modules/events/product-events.actions';
import { TableEventPayloadMap, TableEventResultMap } from '../../modules/events/table-events.actions';
import {
  UserProfileEventPayloadMap,
  UserProfileEventResultMap
} from '../../features/user-profile/user-profile-viewed.event';

export interface EventPayloadMap
  extends TableEventPayloadMap,
    OrderEventPayloadMap,
    CustomerEventPayloadMap,
    ProductEventPayloadMap,
    NotificationEventPayloadMap,
    UserProfileEventPayloadMap,
    AuditEventPayloadMap {}

export interface EventResultMap
  extends TableEventResultMap,
    OrderEventResultMap,
    CustomerEventResultMap,
    ProductEventResultMap,
    NotificationEventResultMap,
    UserProfileEventResultMap,
    AuditEventResultMap {}
