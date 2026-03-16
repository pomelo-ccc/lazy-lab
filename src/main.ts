import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { setupComponentRegistry } from './app/core/decorator/component-bootstrap';

setupComponentRegistry();

bootstrapApplication(App, appConfig).catch((error) => console.error(error));
