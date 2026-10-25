import { OrderStatus, TableStatus } from './tables.models';

/**
 * UI-only mapping from the English status values stored in `db.json`
 * to the Spanish labels shown in the templates.
 */
const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
  free: 'Libre',
  occupied: 'Ocupada',
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  delivered: 'Entregada',
  'in kitchen': 'En cocina',
  pending: 'Pendiente',
};

export function tableStatusLabel(status: TableStatus): string {
  return TABLE_STATUS_LABELS[status] ?? status;
}

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}
