import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';


interface InventoryRow {
  readonly sku: string;
  readonly quantity: number;
  readonly location: string;
}

@Component({
  standalone: true,
  selector: 'app-inventory-table-widget',
  imports: [NzCardModule, NzTableModule],
  template: `
    <nz-card nzSize="small" nzTitle="库存表格">
      <nz-table #inventoryTable [nzData]="rows()" [nzFrontPagination]="false" nzSize="small">
        <thead>
          <tr>
            <th>物料编码</th>
            <th>数量</th>
            <th>库位</th>
          </tr>
        </thead>
        <tbody>
          @for (row of inventoryTable.data; track row.sku) {
            <tr>
              <td>{{ row.sku }}</td>
              <td>{{ row.quantity }}</td>
              <td>{{ row.location }}</td>
            </tr>
          }
        </tbody>
      </nz-table>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTableWidgetComponent {
  protected readonly rows = signal<InventoryRow[]>([
    { sku: 'AX-101', quantity: 42, location: 'A1' },
    { sku: 'AX-155', quantity: 12, location: 'B4' },
    { sku: 'BZ-200', quantity: 87, location: 'C2' }
  ]);
}
