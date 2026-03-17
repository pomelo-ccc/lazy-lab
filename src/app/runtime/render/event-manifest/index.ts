import { Injector } from '@angular/core';

import { EventManifestEntry, SyncEventManifestEntry } from '../../core/event-registry';

import { createTableLazyEventManifest }       from './table.manifest';
import { createOrderLazyEventManifest }       from './order.manifest';
import { createCustomerLazyEventManifest }    from './customer.manifest';
import { createProductLazyEventManifest }     from './product.manifest';
import { createUserProfileLazyEventManifest } from './user-profile.manifest';
import { createNotificationSyncEventManifest } from './notification.manifest';
import { createAuditSyncEventManifest }       from './audit.manifest';

type LazyEventManifestFactory = (injector: Injector) => ReadonlyArray<EventManifestEntry>;
type SyncEventManifestFactory = (injector: Injector) => ReadonlyArray<SyncEventManifestEntry>;

const lazyEventManifestFactories: ReadonlyArray<LazyEventManifestFactory> = [
  createTableLazyEventManifest,
  createOrderLazyEventManifest,
  createCustomerLazyEventManifest,
  createProductLazyEventManifest,
  createUserProfileLazyEventManifest,
];

const syncEventManifestFactories: ReadonlyArray<SyncEventManifestFactory> = [
  createNotificationSyncEventManifest,
  createAuditSyncEventManifest,
];

// ─── 懒加载事件清单 ───────────────────────────────────────────────────────────
//
// 每个域独立维护自己的 manifest 文件；同域事件共享一个 import() chunk。
// 新增业务域只需创建对应的 *.manifest.ts 并在此 spread 进来。
//
export function createRuntimeLazyEventManifest(
  injector: Injector
): ReadonlyArray<EventManifestEntry> {
  return lazyEventManifestFactories.flatMap((createManifest) => createManifest(injector));
}

// ─── 同步事件清单 ─────────────────────────────────────────────────────────────
//
// 这些 service 在 providedIn: 'root'，启动时已在 injector 中，
// handler 直接注册为已 resolved，调用方不会遇到任何异步延迟。
//
export function createRuntimeSyncEventManifest(
  injector: Injector
): ReadonlyArray<SyncEventManifestEntry> {
  return syncEventManifestFactories.flatMap((createManifest) => createManifest(injector));
}
