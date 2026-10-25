import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { LucideUsers } from '@lucide/angular';

import { tableStatusLabel } from '../../status-labels';
import { Table } from '../../tables.models';

@Component({
  selector: 'app-table-card',
  imports: [LucideUsers],
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.css',
})
export class TableCardComponent {

  active = input<boolean>();
  table = input<Table>();

  @Output() selected = new EventEmitter<Table>();

  statusLabel(): string {
    const status = this.table()?.status;
    return status ? tableStatusLabel(status) : '';
  }

  cardClass(): string {
    const bg = this.table()?.status === 'occupied' ? 'text-bg-success' : 'text-bg-secondary';
    const selection = this.active() ? 'border-3 border-primary' : 'border-2 border-light';
    return `card ratio ratio-1x1 rounded-5 border shadow-sm cursor-pointer ${bg} ${selection}`;
  }
}
