import { COMPONENT_ID } from '../../shared/component-ids';
import { EagerHealthWidgetComponent } from '../../widgets/eager/eager-health-widget.component';

import { registerEagerComponent } from './dpp-new-event';
import { registerLazyComponentLoaders } from './new-com.loaders';

let bootstrapped = false;

export function setupComponentRegistry(): void {
  if (bootstrapped) {
    return;
  }

  registerEagerComponent(COMPONENT_ID.eagerHealth, EagerHealthWidgetComponent);
  registerLazyComponentLoaders();
  bootstrapped = true;
}
