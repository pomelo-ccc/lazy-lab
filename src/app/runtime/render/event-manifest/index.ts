import { Injector } from '@angular/core';

import { EventManifestEntry, SyncEventManifestEntry } from '../../core/event-registry';

import { createTableEventManifest }       from './table.manifest';
import { createOrderEventManifest }       from './order.manifest';
import { createCustomerEventManifest }    from './customer.manifest';
import { createProductEventManifest }     from './product.manifest';
import { createUserProfileEventManifest } from './user-profile.manifest';
import { createNotificationEventManifest } from './notification.manifest';
import { createAuditEventManifest }       from './audit.manifest';

// ─── 懒加载事件清单 ───────────────────────────────────────────────────────────
//
// 每个域独立维护自己的 manifest 文件；同域事件共享一个 import() chunk。
// 新增业务域只需创建对应的 *.manifest.ts 并在此 spread 进来。
//
export function createRuntimeLazyEventManifest(
  injector: Injector
): ReadonlyArray<EventManifestEntry> {
  return [
    ...createTableEventManifest(injector),
    ...createOrderEventManifest(injector),
    ...createCustomerEventManifest(injector),
    ...createProductEventManifest(injector),
    ...createUserProfileEventManifest(injector),
  ];
}

// ─── 同步事件清单 ─────────────────────────────────────────────────────────────
//
// 这些 service 在 providedIn: 'root'，启动时已在 injector 中，
// handler 直接注册为已 resolved，调用方不会遇到任何异步延迟。
//
export function createRuntimeSyncEventManifest(
  injector: Injector
): ReadonlyArray<SyncEventManifestEntry> {
  return [
    ...createNotificationEventManifest(injector),
    ...createAuditEventManifest(injector),
  ];
}
