# POS — Angular Point of Sale App

A point-of-sale (POS) web application for restaurants and cafés, built with **Angular 20**
(standalone components + zoneless change detection + signals) and backed by a lightweight
**json-server** mock API.

The goal of the project is a full POS dashboard: manage the dining-room floor, open orders per
table, track kitchen status, and close bills.

> **Status:** the application shell, routing, layout and the **Tables** module are fully
> implemented. Dashboard, Products, Customers, Orders and Auth are scaffolded and ready to be
> built out.

---

## Features

### Implemented

| Area | What it does |
| --- | --- |
| **App shell** | Responsive layout with collapsible desktop sidebar, off-canvas mobile sidebar (backdrop + `Esc` to close) and a top bar that shows the current route title and today's date. |
| **Tables (`/tables`)** | Floor-plan grid of table cards with status color coding and guest count. |
| **Table detail panel** | Shows status, occupancy (`guests/capacity`), the list of orders, and the running bill (subtotal, IVA 16%, total). |
| **Create table** | Modal that auto-assigns the next table number and the `free` status, with capacity validation (1–50). |
| **Edit table** | Modal to change the table size; the number and status are read-only. |
| **Orders per table** | Order list with status badges (`delivered`, `in kitchen`, `pending`) and a full order modal with line items and totals. |
| **Mock API** | json-server serving `db.json`, with an HTTP interceptor that prefixes every request with `http://localhost:3000`. Graceful local seed fallback when the API is down. |

### Planned / stubbed

`Dashboard`, `Products`, `Customers`, `Orders` and `Auth` routes exist and render placeholders.

---

## Tech stack

- **Angular 20** — standalone components, new control flow (`@if` / `@for`), signals, zoneless change detection
- **TypeScript 5.9**
- **Bootstrap 5** (CSS + layout utilities)
- **[Lucide Angular](https://lucide.dev)** icons
- **json-server 1.x** as the REST mock backend
- **RxJS** for HTTP streams
- **Karma / Jasmine** for unit tests
- **pnpm** as the package manager

---

## Getting started

### Prerequisites

- Node.js 20+ (this workspace uses Node 24)
- pnpm (`corepack enable pnpm` or `npm i -g pnpm`)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the app + mock API

```bash
pnpm dev
```

This runs both processes concurrently:

- Angular dev server → <http://localhost:4200>
- json-server → <http://localhost:3000> (reads `db.json`)

You can also run them separately:

```bash
pnpm start   # Angular dev server
pnpm api     # json-server on port 3000
```

### 3. Production build

```bash
pnpm build
```

Output is written to `dist/pos-angular-app/`.

### 4. Unit tests

```bash
pnpm test
```

---

## Project structure

```
src/
├── app/
│   ├── app.config.ts              # Providers: router, zoneless change detection, HttpClient + interceptor
│   ├── app.routes.ts              # Lazy-loaded feature routes
│   ├── app.ts / app.html / app.css # Root shell: top bar + sidebar + router outlet
│   ├── core/
│   │   ├── components/
│   │   │   ├── button/            # Reusable button component
│   │   │   └── sidebar/           # Navigation sidebar (brand, nav pills, collapse controls)
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts# Prefixes every request with API_URL (http://localhost:3000)
│   │   └── services/
│   │       └── layout.service.ts  # Sidebar collapse state, responsive breakpoints, localStorage sync
│   └── features/
│       ├── auth/                  # (stub) Sign-in screen
│       ├── customers/             # (stub) Customer management
│       ├── dashboard/             # (stub) KPIs overview
│       ├── menu/                  # (stub) Menu browsing — not routed yet
│       ├── orders/                # (stub) Order list
│       ├── products/              # (stub) Product catalog
│       └── tables/                # ✅ Tables module (fully implemented)
│           ├── components/
│           │   ├── table-card/    # Grid card: number, status, guest count
│           │   └── table-detail/  # Side panel: status, orders, bill, edit/order modals
│           ├── services/
│           │   └── tables.service.ts  # Signals-based CRUD over /tables
│           ├── status-labels.ts   # English status values → Spanish UI labels
│           ├── tables.models.ts   # TypeScript models mirroring db.json
│           └── tables.component.* # Floor-plan page + "create table" modal
├── main.ts                        # Bootstrap
└── styles.css                     # Global styles
db.json                            # json-server database (mock data)
```

---

## Data model

All **code, model and database keys are written in English**; only the visible UI copy is in
Spanish. The interfaces in `src/app/features/tables/tables.models.ts` mirror `db.json` exactly.

```jsonc
{
  "tables": [
    {
      "id": "2",
      "number": 2,
      "capacity": 4,          // seats available
      "guestCount": 3,        // people currently seated
      "status": "occupied",   // "free" | "occupied"
      "bill": {
        "subtotal": 375,
        "tax": 60,            // IVA 16%
        "total": 435,
        "paid": false
      },
      "orders": [
        {
          "id": 101,
          "tableId": 2,
          "time": "19:10",
          "status": "delivered",   // "delivered" | "in kitchen" | "pending"
          "items": [
            { "product": "Hamburguesa clásica", "quantity": 2, "price": 120 }
          ],
          "total": 310
        }
      ]
    }
  ]
}
```

### TypeScript models

```ts
interface Table {
  id: number;
  number: number;
  capacity: number;
  guestCount: number;
  status: TableStatus;      // 'free' | 'occupied'
  bill: TableBill;
  orders: Order[];
}

interface TableBill {
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean;
}

interface Order {
  id: number;
  tableId?: number;
  time: string;
  status: OrderStatus;      // 'delivered' | 'in kitchen' | 'pending'
  items: OrderItem[];
  total: number;
}

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}
```

---

## API

json-server is served from `db.json`:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/tables` | List all tables (with nested `bill` and `orders`) |
| `POST` | `/tables` | Create a table |
| `PATCH` | `/tables/:id` | Update a table (e.g. change `capacity`) |

Every request made by the app is prefixed with `API_URL` by
`src/app/core/interceptors/auth.interceptor.ts`, so components only use relative paths such as
`/tables`.

If json-server is not running, `TablesService` falls back to the seed data imported from
`db.json`, so the UI keeps working offline.

---

## Naming conventions

- **Identifiers, models, database keys and status values are in English**
  (`guestCount`, `tableId`, `bill.tax`, `"free"`).
- **Visible UI copy is in Spanish** (labels, buttons, modal text, route titles).
- Status values are stored in English and translated for display in
  `src/app/features/tables/status-labels.ts`.

---

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run Angular dev server + json-server together |
| `pnpm start` | Angular dev server only |
| `pnpm api` | json-server only |
| `pnpm build` | Production build to `dist/` |
| `pnpm watch` | Rebuild on change (development configuration) |
| `pnpm test` | Unit tests (Karma + Jasmine) |

---

## License

No license specified yet.
