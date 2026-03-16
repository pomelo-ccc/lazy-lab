import { Routes } from '@angular/router';
import { defer, map } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'page-1'
  },
  {
    path: 'page-1',
    loadComponent: () =>
      defer(() => import('./pages/page-one/page-one.component')).pipe(map((m) => m.PageOneComponent))
  },
  {
    path: 'page-2',
    loadComponent: () =>
      defer(() => import('./pages/page-two/page-two.component')).pipe(map((m) => m.PageTwoComponent))
  },
  {
    path: 'page-3',
    loadComponent: () =>
      defer(() => import('./pages/page-three/page-three.component')).pipe(map((m) => m.PageThreeComponent))
  },
  {
    path: 'page-4',
    loadComponent: () =>
      defer(() => import('./pages/page-four/page-four.component')).pipe(map((m) => m.PageFourComponent))
  },
  {
    path: 'page-5',
    loadComponent: () =>
      defer(() => import('./pages/page-five/page-five.component')).pipe(map((m) => m.PageFiveComponent))
  },
  {
    path: 'runtime-demo',
    loadComponent: () =>
      defer(() => import('./pages/runtime-demo/runtime-demo.component')).pipe(
        map((m) => m.RuntimeDemoComponent)
      )
  },
  {
    path: '**',
    redirectTo: 'page-1'
  }
];
