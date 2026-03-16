import { LAZY_COMPONENT_IDS } from '../../shared/component-ids';
import { registerNewComLazy } from './dpp-new-event';
import { LAZY_COMPONENT_MANIFEST } from './manifests';

let installed = false;

export function registerLazyComponentLoaders(): void {
  if (installed) {
    return;
  }

  validateManifest();

  for (const entry of LAZY_COMPONENT_MANIFEST) {
    registerNewComLazy(entry.id, entry.loader);
  }

  installed = true;
}

function validateManifest(): void {
  const expectedSet = new Set<string>(LAZY_COMPONENT_IDS);
  const seenSet = new Set<string>();

  for (const entry of LAZY_COMPONENT_MANIFEST) {
    if (!expectedSet.has(entry.id)) {
      throw new Error(
        `[LoaderManifestError] id="${entry.id}" 未在 LAZY_COMPONENT_IDS 中声明。` +
          '请先补充 shared/component-ids.ts。'
      );
    }

    if (seenSet.has(entry.id)) {
      throw new Error(`[LoaderManifestError] 检测到重复 loader，id="${entry.id}"。`);
    }

    seenSet.add(entry.id);
  }

  for (const expectedId of expectedSet) {
    if (!seenSet.has(expectedId)) {
      throw new Error(`[LoaderManifestError] 缺少 loader，id="${expectedId}"。`);
    }
  }
}
