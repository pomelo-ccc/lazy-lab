import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

interface MenuEntry {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NzLayoutModule, NzMenuModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly menuEntries: ReadonlyArray<MenuEntry> = [
    { path: '/page-1', label: '页面 1' },
    { path: '/page-2', label: '页面 2' },
    { path: '/page-3', label: '页面 3' },
    { path: '/page-4', label: '页面 4' },
    { path: '/page-5', label: '页面 5' },
    { path: '/runtime-demo', label: 'Runtime 试点' }
  ];
}
