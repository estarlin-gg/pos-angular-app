export type TableStatus = 'free' | 'occupied';

export type OrderStatus = 'delivered' | 'in kitchen' | 'pending';

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  tableId?: number;
  time: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

export interface TableBill {
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  guestCount: number;
  status: TableStatus;
  bill: TableBill;
  orders: Order[];
}
