import { Component, inject, input, signal } from '@angular/core';
import { LucideEye } from '@lucide/angular';

import { TablesService } from '../../services/tables.service';
import {
  orderStatusLabel as getOrderStatusLabel,
  tableStatusLabel as getTableStatusLabel,
} from '../../status-labels';
import { Order, OrderItem, Table } from '../../tables.models';

@Component({
  selector: 'app-table-detail',
  imports: [LucideEye],
  templateUrl: './table-detail.component.html',
  styleUrl: './table-detail.component.css',
})
export class TableDetailComponent {
  private readonly service = inject(TablesService);

  table = input.required<Table>();

  activeOrder: Order | null = null;

  /** Modal to edit the table. */
  readonly editing = signal(false);
  readonly capacityDraft = signal(0);

  openOrder(order: Order): void {
    this.activeOrder = order;
  }

  closeOrder(): void {
    this.activeOrder = null;
  }

  itemTotal(item: OrderItem): number {
    return item.quantity * item.price;
  }

  money(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  tableStatusLabel(): string {
    return getTableStatusLabel(this.table().status);
  }

  orderStatusLabel(order: Order): string {
    return getOrderStatusLabel(order.status);
  }

  tableStatusBadge(): string {
    return this.table().status === 'occupied' ? 'badge text-bg-danger' : 'badge text-bg-success';
  }

  orderStatusBadge(order: Order): string {
    switch (order.status) {
      case 'delivered':
        return 'badge text-bg-success';
      case 'in kitchen':
        return 'badge text-bg-warning';
      default:
        return 'badge text-bg-secondary';
    }
  }

  openEdit(): void {
    this.capacityDraft.set(this.table().capacity);
    this.editing.set(true);
  }

  closeEdit(): void {
    this.editing.set(false);
  }

  onCapacityInput(event: Event): void {
    this.capacityDraft.set(Number((event.target as HTMLInputElement).value));
  }

  get editValid(): boolean {
    const size = this.capacityDraft();
    return Number.isFinite(size) && size >= 1 && size <= 50;
  }

  /** Saves the table size (capacity). */
  saveEdit(): void {
    if (!this.editValid) {
      return;
    }

    this.service.updateTable(this.table().id, { capacity: this.capacityDraft() });
    this.closeEdit();
  }
}
