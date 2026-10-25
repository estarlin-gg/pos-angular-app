import { Component, computed, inject, signal } from '@angular/core';

import { TableCardComponent } from './components/table-card/table-card.component';
import { TableDetailComponent } from './components/table-detail/table-detail.component';
import { TablesService } from './services/tables.service';
import { Table } from './tables.models';

@Component({
  selector: 'app-tables',
  imports: [TableCardComponent, TableDetailComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent {
  protected readonly service = inject(TablesService);

  private readonly selected = signal<Table | null>(null);

  /** Modal to create a table. */
  readonly creating = signal(false);
  readonly capacityDraft = signal(4);

  readonly freeTables = computed(
    () => this.service.tables().filter((t) => t.status === 'free').length,
  );

  readonly occupiedTables = computed(
    () => this.service.tables().filter((t) => t.status === 'occupied').length,
  );

  /** Table shown in the detail panel. */
  readonly detail = computed<Table | null>(() => {
    const tables = this.service.tables();
    return this.selected() ?? tables.find((t) => t.status === 'occupied') ?? tables[0] ?? null;
  });

  readonly nextNumber = computed(() => {
    const tables = this.service.tables();
    return tables.length ? Math.max(...tables.map((t) => t.number)) + 1 : 1;
  });

  /** Next id, used when json-server is not running (local fallback). */
  private readonly nextId = computed(() => {
    const tables = this.service.tables();
    return tables.length ? Math.max(...tables.map((t) => t.id)) + 1 : 1;
  });

  constructor() {
    this.service.load();
  }

  select(table: Table): void {
    this.selected.set(table);
  }

  isSelected(table: Table): boolean {
    return this.detail()?.id === table.id;
  }

  openCreate(): void {
    this.capacityDraft.set(4);
    this.creating.set(true);
  }

  closeCreate(): void {
    this.creating.set(false);
  }

  onCapacityInput(event: Event): void {
    this.capacityDraft.set(Number((event.target as HTMLInputElement).value));
  }

  get createValid(): boolean {
    const size = this.capacityDraft();
    return Number.isFinite(size) && size >= 1 && size <= 50;
  }

  /** Creates the table: number and free status are assigned automatically. */
  createTable(): void {
    if (!this.createValid) {
      return;
    }

    this.service.addTable({
      id: this.nextId(),
      number: this.nextNumber(),
      capacity: this.capacityDraft(),
      guestCount: 0,
      status: 'free',
      bill: { subtotal: 0, tax: 0, total: 0, paid: false },
      orders: [],
    });

    this.closeCreate();
  }
}
