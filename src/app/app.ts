import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LucideMenu } from '@lucide/angular';
import { filter, fromEvent } from 'rxjs';

import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { LayoutService } from './core/services/layout.service';

const DESKTOP_QUERY = '(min-width: 992px)';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LucideMenu],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class App {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly layout = inject(LayoutService);
  protected readonly isDesktop = signal(this.matchesDesktop());
  protected readonly pageTitle = signal('POS');
  protected readonly today = this.formatToday();

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updatePageTitle();
        this.layout.closeMobileSidebar();
      });

    this.updatePageTitle();

    if (typeof window !== 'undefined') {
      const desktopQuery = window.matchMedia(DESKTOP_QUERY);
      this.isDesktop.set(desktopQuery.matches);

      fromEvent<MediaQueryListEvent>(desktopQuery, 'change')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          this.isDesktop.set(event.matches);

          if (event.matches) {
            this.layout.closeMobileSidebar();
          }
        });
    }
  }

  protected onEscape(): void {
    this.layout.closeMobileSidebar();
  }

  private matchesDesktop(): boolean {
    return typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
  }

  private updatePageTitle(): void {
    let route = this.router.routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    this.pageTitle.set(route.snapshot.title ?? 'POS');
  }

  private formatToday(): string {
    const formatted = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
