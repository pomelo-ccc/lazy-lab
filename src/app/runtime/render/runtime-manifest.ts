// 组件清单与事件清单分别维护，通过此文件统一对外导出。
// RuntimeRegistryService 只需从这里 import，不感知内部拆分细节。

export { RUNTIME_COMPONENT_MANIFEST } from './component-manifest';
export { createRuntimeLazyEventManifest, createRuntimeSyncEventManifest } from './event-manifest/index';
