import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

import db from '../../../../../db.json';
import { Table } from '../tables.models';

const TABLES_SEED: Table[] = (db as unknown as { tables: Table[] }).tables;

const TABLES_ENDPOINT = '/tables';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  private readonly http = inject(HttpClient);

  tables = signal<Table[]>([]);
  readonly loading = signal(false);

  load(): void {
    this.loading.set(true);

    this.http
      .get<Table[]>(TABLES_ENDPOINT)
      .pipe(
        catchError(() => of<Table[] | null>(null)),
        tap((tables) => {
          this.tables.set(tables && tables.length ? tables : TABLES_SEED);
          this.loading.set(false);
        }),
      )
      .subscribe();
  }

  addTable(table: Table): void {
    this.http
      .post<Table>(TABLES_ENDPOINT, table)
      .pipe(
        catchError(() => of<Table | null>(null)),
        tap((newTable) => {
          this.tables.update((currentTables) => [...currentTables, newTable ?? table]);
        }),
      )
      .subscribe();
  }

  updateTable(id: number, changes: Partial<Table>): void {
    this.http
      .patch<Table>(`${TABLES_ENDPOINT}/${id}`, changes)
      .pipe(
        catchError(() => of<Table | null>(null)),
        tap((updated) => {
          this.tables.update((currentTables) =>
            currentTables.map((t) => (t.id === id ? { ...t, ...changes, ...(updated ?? {}) } : t)),
          );
        }),
      )
      .subscribe();
  }
}
