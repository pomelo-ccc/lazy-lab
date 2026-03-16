import { RuntimeToolbarButtonConfig, isIconToolbarButtonConfig } from '../../type/runtime-table-config';

export type PButtonVariant = 'text' | 'icon';

export function resolvePButtonVariant(button: RuntimeToolbarButtonConfig): PButtonVariant {
  return isIconToolbarButtonConfig(button) ? 'icon' : 'text';
}
